package com.moong.exception.analyzer;

import aj.org.objectweb.asm.Type;
import com.moong.exception.dto.AnalyzeErrorRequest;
import com.moong.exception.dto.AnalyzeErrorResponse;
import com.moong.exception.dto.MethodSignatureInfo;
import com.moong.exception.dto.ParameterInfo;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.StringJoiner;
import java.util.concurrent.CompletableFuture;
import lombok.extern.slf4j.Slf4j;
import org.objectweb.asm.ClassReader;
import org.objectweb.asm.Opcodes;
import org.objectweb.asm.tree.AbstractInsnNode;
import org.objectweb.asm.tree.ClassNode;
import org.objectweb.asm.tree.LineNumberNode;
import org.objectweb.asm.tree.MethodNode;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.web.reactive.function.client.WebClient;

@Slf4j
public class LlmErrorAnalyzer implements ErrorAnalyzer {

    private final WebClient webClient;
    private final LlmProperties llmProperties;

    public LlmErrorAnalyzer(
            WebClient.Builder webClientBuilder,
            LlmProperties llmProperties
    ) {
        this.webClient = webClientBuilder.build();
        this.llmProperties = llmProperties;
    }

    @Async
    public CompletableFuture<AnalyzeErrorResponse> analyze(AnalyzeErrorRequest request) {
        List<StackTraceElement> stackTraceElements = Arrays.stream(request.exception().getStackTrace())
                .toList();

        StringJoiner joiner = new StringJoiner(System.lineSeparator());
        joiner.add("httpMethod: " + request.httpMethod().toLowerCase());
        joiner.add("requestUrl: " + request.path());
        joiner.add("cause : " + getStackTraceAsString(request.exception().getMessage(), stackTraceElements));
        joiner.add("methodSignatures : " + getMethodSignatures(stackTraceElements));
        Map<String, String> requestBody = Map.of("question", joiner.toString().trim());

        log.info("LLM Analyzer request body: {}", requestBody);

        return webClient.post()
                .uri(llmProperties.baseUrl() + llmProperties.id())
                .contentType(MediaType.APPLICATION_JSON)
                .headers(httpHeaders -> httpHeaders.setBearerAuth(llmProperties.key()))
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(AnalyzeErrorResponse.class)
                .toFuture();
    }

    private String getStackTraceAsString(String message, List<StackTraceElement> stackTrace) {
        StringJoiner joiner = new StringJoiner("\n");
        joiner.add(message);
        stackTrace.forEach(element -> joiner.add(element.toString()));
        return joiner.toString();
    }

    public List<MethodSignatureInfo> getMethodSignatures(List<StackTraceElement> stackTraceElements) {
        return stackTraceElements.stream()
                .map(element -> getMethodSignature(element.getClassName(), element.getLineNumber()))
                .filter(Objects::nonNull)
                .toList();
    }

    private MethodSignatureInfo getMethodSignature(String className, int lineToFind) {
        InputStream classInputStream = getClass()
                .getClassLoader()
                .getResourceAsStream(className.replace('.', '/') + ".class");

        if (classInputStream == null) {
            return null;
        }

        ClassNode classNode = new ClassNode(Opcodes.ASM9);
        try {
            ClassReader classReader = new ClassReader(classInputStream);
            classReader.accept(classNode, ClassReader.EXPAND_FRAMES);
        } catch (IOException e) {
            return null;
        }

        for (MethodNode method : classNode.methods) {
            if (method.instructions == null) {
                continue;
            }

            for (AbstractInsnNode insn = method.instructions.getFirst();
                 insn != null;
                 insn = insn.getNext()) {

                if (insn instanceof LineNumberNode line) {
                    if (line.line == lineToFind) {
                        return extractMethodSignature(className, lineToFind, method);
                    }
                }
            }
        }
        return null;
    }

    public MethodSignatureInfo extractMethodSignature(
            String className,
            int lineNumber,
            MethodNode method
    ) {
        Type[] argumentTypes = Type.getArgumentTypes(method.desc);

        List<String> parameterNames = new ArrayList<>();

        if (method.localVariables != null) {
            // 첫 번째 local variable은 this (인스턴스 메서드)
            for (int i = 1; i <= argumentTypes.length && i < method.localVariables.size(); i++) {
                parameterNames.add(method.localVariables.get(i).name);
            }
        }

        List<ParameterInfo> parameters = new ArrayList<>();
        for (int i = 0; i < argumentTypes.length; i++) {
            String paramName = i < parameterNames.size() ? parameterNames.get(i) : null;
            parameters.add(new ParameterInfo(paramName, argumentTypes[i].getClassName()));
        }

        return new MethodSignatureInfo(
                className,
                lineNumber,
                parameters,
                Type.getReturnType(method.desc).getClassName()
        );
    }
}
