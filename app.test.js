const request = require("supertest");
const app = require("./app");

describe("Pruebas de mi API", () => {
    // TEST 1: Probando la ruta GET
    test("GET /api/saludo debe devolver un JSON con mensaje de Hola Mundo", async () => {
        // Hacemos la petición simulada
        const response = await request(app).get("/api/saludo");

        // Validaciones (Expects)
        expect(response.statusCode).toBe(200); // ¿El código es 200 OK?
        expect(response.headers["content-type"]).toMatch(/json/); // ¿Es JSON?
        expect(response.body.mensaje).toBe("Hola mundo"); // ¿El mensaje es correcto?
    });

    // TEST 2: Probando la ruta POST
    test("POST /api/suma debe sumar dos números correctamente", async () => {
        const datosEnviar = { numeroA: 5, numeroB: 10 };

        const response = await request(app).post("/api/suma").send(datosEnviar); // Enviamos el body

        expect(response.statusCode).toBe(200);
        expect(response.body.resultado).toBe(15);
    });

    // TEST 3: Probando manejo de errores (si faltan datos)
    test("POST /api/suma debe fallar si no envío números", async () => {
        const response = await request(app).post("/api/suma").send({}); // Enviamos vacío

        expect(response.statusCode).toBe(400); // Esperamos un error Bad Request
        expect(response.body.error).toBe("Faltan numeros");
    });
});
