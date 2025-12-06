# Guía de Implementación de Testing Básico (API Express)

Este documento detalla el proceso de configuración y creación de pruebas automatizadas (Unit/Integration Testing) para una API REST construida con Express.js.

## 🛠 Tecnologías Utilizadas

* **Node.js & Express:** Entorno de ejecución y framework backend.
* **Jest:** Framework de Testing (nuestro "ejecutor" de pruebas).
* **Supertest:** Librería para simular peticiones HTTP a la API sin necesidad de tener el servidor escuchando en un puerto activo.

## 📋 1. Instalación

Para replicar este entorno, se deben instalar las siguientes dependencias en el proyecto:

```bash
# 1. Inicializar el proyecto
npm init -y

# 2. Instalar Express
npm install express

# 3. Instalar herramientas de Testing
npm install --save-dev jest supertest
```

## ⚙️ 2. Configuración del Entorno

### Modificación del `package.json`
Es necesario decirle a Node que cuando ejecutemos el comando de test, utilice **Jest**.

En el archivo `package.json`, busca la sección `"scripts"` y revisa que esté lo siguiente:

```json
"scripts": {
  "start": "node server.js",
  "test": "jest"
}
```

## 🏗 3. Estructura y Código

Para realizar testing efectivo en Express, aplicamos una buena práctica: **Separar la definición de la App de la ejecución del Servidor**.

### A. Estructura de Archivos
```text
/testing
  ├── app.js         # Lógica de rutas y configuración de Express (exporta 'app')
  ├── app.test.js    # Archivo de pruebas (contiene los tests)
```

### B. El Código (`app.js`)
*Creamos la lógica pero NO iniciamos el puerto aquí. Exportamos la instancia `app`.*

```javascript
const express = require('express');
const app = express();

app.use(express.json()); // Middleware para leer JSON

// Endpoint GET de prueba
app.get('/api/saludo', (req, res) => {
  res.status(200).json({ mensaje: 'Hola mundo', estado: 'exitoso' });
});

// Endpoint POST de prueba (Suma)
app.post('/api/suma', (req, res) => {
  const { numeroA, numeroB } = req.body;
  
  if (!numeroA || !numeroB) {
    return res.status(400).json({ error: 'Faltan numeros' });
  }

  const resultado = numeroA + numeroB;
  res.status(200).json({ resultado });
});

module.exports = app;
```

### C. El Test (`app.test.js`)
*Importamos `app` y usamos `supertest` para lanzar peticiones contra ella.*

```javascript
const request = require('supertest');
const app = require('./app');

describe('Pruebas de Integración de API', () => {

  // Test 1: Verificar respuesta GET
  test('GET /api/saludo -> Debe devolver JSON con mensaje', async () => {
    const res = await request(app).get('/api/saludo');
    
    expect(res.statusCode).toBe(200);
    expect(res.body.mensaje).toBe('Hola mundo');
  });

  // Test 2: Verificar respuesta POST correcta
  test('POST /api/suma -> Debe sumar dos números', async () => {
    const res = await request(app)
      .post('/api/suma')
      .send({ numeroA: 5, numeroB: 10 });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.resultado).toBe(15);
  });

  // Test 3: Verificar validación de errores
  test('POST /api/suma -> Debe fallar si faltan datos', async () => {
    const res = await request(app)
      .post('/api/suma')
      .send({}); // Enviamos body vacío
    
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Faltan numeros');
  });

});
```

## 🚀 4. Ejecución

Para correr las pruebas, ejecutar en la terminal:

```bash
npm test
```

**Resultado esperado:** Jest escaneará el proyecto, encontrará `app.test.js`, ejecutará las 3 pruebas y mostrará un resumen en verde indicando que todo ha pasado correctamente.