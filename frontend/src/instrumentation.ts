export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { tracer } = await import("dd-trace");

    tracer.init({
      logInjection: true,
      env: process.env.DD_ENV,
      service: process.env.DD_SERVICE,
    });

    tracer.use("next");
  }
}
