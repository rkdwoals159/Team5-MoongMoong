package com.moong.ai.mapper;

import static com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES;

import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.BeanProperty;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.deser.ContextualDeserializer;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import com.moong.ai.OpenAiResult;
import com.moong.ai.TokenUsage;
import java.io.IOException;
import java.util.stream.StreamSupport;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class OpenAiResultDeserializer
        extends StdDeserializer<OpenAiResult<?>>
        implements ContextualDeserializer {

    private static final ObjectMapper MAPPER = new ObjectMapper()
            .findAndRegisterModules()
            .configure(FAIL_ON_UNKNOWN_PROPERTIES, false);

    private final JavaType resultType;

    public OpenAiResultDeserializer() {
        super(OpenAiResult.class);
        this.resultType = null;
    }

    public OpenAiResultDeserializer(JavaType resultType) {
        super(OpenAiResult.class);
        this.resultType = resultType;
    }

    @Override
    public JsonDeserializer<?> createContextual(
            DeserializationContext ctxt,
            BeanProperty property
    ) {

        JavaType contextualType =
                property != null
                        ? property.getType()
                        : ctxt.getContextualType();

        if (contextualType == null || contextualType.containedTypeCount() == 0) {
            return this;
        }

        JavaType innerType = contextualType.containedType(0);
        return new OpenAiResultDeserializer(innerType);
    }

    @Override
    public OpenAiResult<?> deserialize(
            JsonParser jsonParser,
            DeserializationContext deserializationContext
    ) throws IOException {
        JsonNode root = jsonParser.getCodec().readTree(jsonParser);

        //output → message → text
        JsonNode output = root.path("output");

        JsonNode textNode = StreamSupport.stream(output.spliterator(), false)
                .filter(n -> "message".equals(n.path("type").asText()))
                .findFirst()
                .orElseThrow(() -> new JsonMappingException(jsonParser, "message type not found"))
                .path("content")
                .get(0)
                .path("text");

        if (textNode.isMissingNode()) {
            throw new JsonMappingException(jsonParser, "text not found");
        }

        //text → T 파싱
        Object result = MAPPER.readValue(
                textNode.asText(),
                resultType
        );

        //token usage 파싱
        JsonNode usageNode = root.path("usage");

        TokenUsage tokenUsage = new TokenUsage(
                usageNode.path("input_tokens").asLong(),
                usageNode.path("output_tokens").asLong(),
                usageNode.path("total_tokens").asLong()
        );

        return new OpenAiResult<>(result, tokenUsage);
    }
}
