# NASA Mars Weather AI Assistant

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=flat&logo=openai&logoColor=white)](https://openai.com/)
[![NASA](https://img.shields.io/badge/NASA-0B3D91?style=flat&logo=nasa&logoColor=white)](https://api.nasa.gov/)

## Tabla de Contenidos

- [Descripción del Proyecto](#descripción-del-proyecto)
- [Stack Tecnológico](#stack-tecnológico)
- [Instalación y Configuración](#instalación-y-configuración)
- [Documentación de la API](#documentación-de-la-api)
- [Validaciones y Manejo de Errores](#validaciones-y-manejo-de-errores)
- [Ejemplos de Uso Avanzado](#ejemplos-de-uso-avanzado)
- [Troubleshooting](#troubleshooting)

---

## Descripción del Proyecto

Sistema backend desarrollado en NestJS que integra datos meteorológicos oficiales de Marte con capacidades de inteligencia artificial para análisis avanzados. La aplicación consume datos en tiempo real de la misión NASA InSight Mars Lander y proporciona una API RESTful completa para consultas científicas.

### Características Principales

- **Integración NASA API**: Consume datos meteorológicos oficiales de la misión InSight
- **Almacenamiento Local**: Base de datos SQLite con TypeORM para persistencia optimizada
- **Inteligencia Artificial**: Análisis avanzado con OpenAI GPT-4o-mini
- **API RESTful**: Endpoints completamente documentados con validaciones robustas
- **Análisis Científico**: Capacidades de procesamiento y análisis estadístico de datos marcianos

### Casos de Uso

- Consulta de condiciones meteorológicas marcianas históricas
- Análisis de tendencias climáticas mediante IA
- Integración con aplicaciones científicas y educativas
- Procesamiento de datos para investigación espacial

---

## Stack Tecnológico

### Framework Backend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| NestJS | v11 | Framework modular y escalable |
| TypeScript | Latest | Tipado estático y confiabilidad |
| Node.js | >= 18 | Runtime de JavaScript |

### Base de Datos

| Tecnología | Propósito |
|------------|-----------|
| SQLite | Base de datos embebida |
| TypeORM | ORM con soporte para migraciones |

### Integraciones

| Servicio | API | Propósito |
|----------|-----|-----------|
| NASA | InSight Mars Weather API | Datos meteorológicos oficiales |
| OpenAI | GPT-4o-mini | Análisis inteligente |

### Validación y Seguridad

- **class-validator**: Validación de DTOs
- **class-transformer**: Transformación de objetos
- **Manejo de errores**: Sistema centralizado de excepciones

### Datos Científicos - NASA InSight

**Misión**: Interior Exploration using Seismic Investigations, Geodesy and Heat Transport  
**Ubicación**: Elysium Planitia, Marte (4.5°N, 135.9°E)  
**Período**: Noviembre 2018 - Diciembre 2022  
**Datos Disponibles**: Temperatura, presión atmosférica, velocidad del viento

---

## Instalación y Configuración

### Prerrequisitos

```bash
node --version  # >= 18.0.0
npm --version   # >= 8.0.0
```

### Claves de API Requeridas

1. **NASA API Key**: Gratuita en <https://api.nasa.gov/>
2. **OpenAI API Key**: Disponible en <https://platform.openai.com/>

### Instalación

```bash
# 1. Clonar repositorio
git clone https://github.com/tu-usuario/mars-weather-api.git
cd mars-weather-api

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
```

### Configuración del archivo .env

```env
# NASA API Configuration
NASA_API_KEY=tu_clave_nasa_aqui

# OpenAI Configuration
OPENAI_API_KEY=tu_clave_openai_aqui

# Database
DATABASE_PATH=./mars_weather.db

# Server
PORT=3000
NODE_ENV=development
```

### Ejecución

```bash
# Desarrollo (con hot reload)
npm run start:dev

# Producción
npm run build
npm run start:prod
```

### Verificación de Instalación

```bash
# Test de conectividad
curl http://localhost:3000/api/weather-data?limit=1

# Respuesta exitosa esperada
{
  "success": true,
  "data": [...],
  "message": "Datos obtenidos exitosamente"
}
```

---

## Documentación de la API

**URL Base**: `http://localhost:3000/api`

La API está organizada en 3 módulos principales con endpoints completamente documentados, incluyendo ejemplos prácticos, validaciones y manejo de errores.

### Estructura de Respuestas

Todas las respuestas siguen el formato estándar:

```json
{
  "success": boolean,
  "message": string,
  "data": any
}
```

**Códigos de Estado HTTP**:

- `200`: Operación exitosa
- `400`: Error de validación
- `404`: Recurso no encontrado
- `500`: Error interno del servidor

---

### Módulo NASA API

**Endpoint**: `POST /api/nasa-api/fetch`

Obtiene datos meteorológicos directamente de la NASA InSight API sin procesar ni almacenar.

#### Ejemplo Básico

```bash
curl -X POST http://localhost:3000/api/nasa-api/fetch
```

#### Respuesta Exitosa

```json
{
  "success": true,
  "message": "Datos del clima de Marte obtenidos exitosamente",
  "data": {
    "sol_keys": ["675", "676", "677"],
    "675": {
      "AT": {"av": -62.314, "mn": -96.872, "mx": -15.908},
      "PRE": {"av": 750.563},
      "HWS": {"av": 7.233},
      "WD": {"most_common": {"compass_point": "WNW"}}
    }
  }
}
```

#### Casos de Uso Avanzados

**Análisis de temperatura específica:**

```bash
curl -s -X POST http://localhost:3000/api/nasa-api/fetch | \
jq '.data["675"].AT | {temp_promedio: .av, temp_min: .mn, temp_max: .mx}'
```

**Análisis de presión atmosférica:**

```bash
curl -s -X POST http://localhost:3000/api/nasa-api/fetch | \
jq '.data | to_entries | map({sol: .key, presion: .value.PRE.av}) | sort_by(.presion)'
```

#### Posibles Errores

| Error | Código | Causa |
|-------|--------|-------|
| NASA API no disponible | 503 | Servicio externo caído |
| Timeout de conexión | 408 | Red lenta o intermitente |

---

### Módulo Weather Data

Maneja almacenamiento, recuperación y gestión de datos meteorológicos en base de datos local.

#### POST /api/weather-data/fetch-and-save

Sincroniza datos de NASA y los almacena localmente evitando duplicados.

**Ejemplo:**

```bash
curl -X POST http://localhost:3000/api/weather-data/fetch-and-save
```

**Respuesta (primera ejecución):**

```json
{
  "success": true,
  "message": "Se guardaron exitosamente 7 registros meteorológicos",
  "data": [
    {
      "id": 1,
      "sol": 675,
      "averageTemperature": -62.314,
      "minTemperature": -96.872,
      "maxTemperature": -15.908,
      "pressure": 750.563,
      "windSpeed": 7.233,
      "windDirection": "WNW",
      "season": "fall",
      "earthDate": "2020-10-19T18:32:20.000Z"
    }
  ]
}
```

**Respuesta (ejecuciones posteriores):**

```json
{
  "success": true,
  "message": "Se guardaron exitosamente 0 registros meteorológicos",
  "data": []
}
```

#### GET /api/weather-data

Recupera datos meteorológicos con paginación.

**Parámetros de Query:**

| Parámetro | Tipo | Descripción | Valor por defecto |
|-----------|------|-------------|-------------------|
| `limit` | number | Número máximo de registros (1-1000) | 10 |
| `offset` | number | Número de registros a omitir | 0 |

**Ejemplo básico:**

```bash
curl http://localhost:3000/api/weather-data
```

**Ejemplo con paginación:**

```bash
curl "http://localhost:3000/api/weather-data?limit=5&offset=10"
```

**Respuesta:**

```json
{
  "success": true,
  "message": "Datos meteorológicos obtenidos exitosamente",
  "data": [
    {
      "id": 1,
      "sol": 675,
      "averageTemperature": -62.314,
      "pressure": 750.563,
      "windSpeed": 7.233,
      "windDirection": "WNW",
      "season": "fall"
    }
  ]
}
```

#### GET /api/weather-data/:sol

Obtiene datos de un Sol (día marciano) específico.

**Ejemplo:**

```bash
curl http://localhost:3000/api/weather-data/675
```

**Respuesta exitosa:**

```json
{
  "success": true,
  "message": "Datos del Sol 675 obtenidos exitosamente",
  "data": {
    "id": 1,
    "sol": 675,
    "averageTemperature": -62.314,
    "minTemperature": -96.872,
    "maxTemperature": -15.908,
    "pressure": 750.563,
    "windSpeed": 7.233,
    "windDirection": "WNW",
    "season": "fall",
    "earthDate": "2020-10-19T18:32:20.000Z"
  }
}
```

**Sol no encontrado:**

```json
{
  "success": true,
  "message": "No se encontraron datos para este Sol",
  "data": null
}
```

---

### Módulo AI Assistant

**Endpoint**: `POST /api/ai-assistant/ask`

Permite realizar consultas en lenguaje natural sobre los datos meteorológicos usando GPT-4o-mini.

#### Ejemplo Básico

```bash
curl -X POST http://localhost:3000/api/ai-assistant/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "¿Cuál fue la temperatura más alta registrada?"}'
```

#### Respuesta

```json
{
  "success": true,
  "message": "Consulta procesada exitosamente",
  "data": {
    "question": "¿Cuál fue la temperatura más alta registrada?",
    "answer": "Basándome en los datos meteorológicos disponibles de la misión NASA InSight, la temperatura más alta registrada fue de -4.444°C en el Sol 681 (25 de octubre de 2020). Esta temperatura máxima se registró durante el período de otoño marciano en Elysium Planitia..."
  }
}
```

#### Ejemplos de Consultas Avanzadas

**Análisis comparativo:**

```bash
curl -X POST http://localhost:3000/api/ai-assistant/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "Compara las condiciones meteorológicas entre los Soles 675 y 681"}'
```

**Análisis de tendencias:**

```bash
curl -X POST http://localhost:3000/api/ai-assistant/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "¿Qué patrones climáticos observas en los datos de otoño marciano?"}'
```

**Consultas técnicas:**

```bash
curl -X POST http://localhost:3000/api/ai-assistant/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "¿Por qué hay diferencias en el número de muestras entre sensores?"}'
```

---

## Validaciones y Manejo de Errores

### Validaciones Implementadas

#### Parámetros de URL

- **Sol**: Debe ser un número entero positivo
- **Límite de rango**: Sol entre 1 y 9999

#### Parámetros de Query

- **limit**: Entero entre 1 y 1000 (default: 10)
- **offset**: Entero mayor o igual a 0 (default: 0)

#### Cuerpo de Petición (AI Assistant)

- **question**: String no vacío, máximo 1000 caracteres

### Ejemplos de Errores de Validación

#### Sol inválido:

```bash
curl http://localhost:3000/api/weather-data/abc
```

**Respuesta:**

```json
{
  "statusCode": 400,
  "message": "El parámetro sol debe ser un número válido",
  "error": "Bad Request"
}
```

#### Límite fuera de rango:

```bash
curl "http://localhost:3000/api/weather-data?limit=2000"
```

**Respuesta:**

```json
{
  "statusCode": 400,
  "message": "El parámetro limit no puede ser mayor a 1000",
  "error": "Bad Request"
}
```

#### Pregunta vacía:

```bash
curl -X POST http://localhost:3000/api/ai-assistant/ask \
  -H "Content-Type: application/json" \
  -d '{"question": ""}'
```

**Respuesta:**

```json
{
  "statusCode": 400,
  "message": "La pregunta no puede estar vacía",
  "error": "Bad Request"
}
```

### Errores del Sistema

#### Endpoint no encontrado:

```bash
curl http://localhost:3000/api/endpoint-inexistente
```

**Respuesta:**

```json
{
  "statusCode": 404,
  "message": "Cannot GET /api/endpoint-inexistente",
  "error": "Not Found"
}
```

#### Error interno del servidor:

```json
{
  "statusCode": 500,
  "message": "Error interno del servidor",
  "error": "Internal Server Error"
}
```

---

## Troubleshooting

### Problemas Comunes

#### Error: "Cannot connect to NASA API"

**Causa**: API de NASA no disponible o problema de red  
**Solución**:

1. Verificar conectividad a internet
2. Verificar que la API key de NASA sea válida
3. Intentar más tarde si el servicio está caído

```bash
# Verificar API key
curl "https://api.nasa.gov/insight_weather/?api_key=TU_API_KEY&feedtype=json&ver=1.0"
```

#### Error: "OpenAI API request failed"

**Causa**: Problema con la API de OpenAI  
**Solución**:

1. Verificar que la API key de OpenAI sea válida
2. Verificar saldo en la cuenta de OpenAI
3. Verificar límites de rate limiting

```bash
# Verificar API key OpenAI
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer TU_OPENAI_API_KEY"
```

#### Error: "Database connection failed"

**Causa**: Problema con la base de datos SQLite  
**Solución**:

1. Verificar permisos de escritura en el directorio
2. Verificar que el archivo .env tenga la ruta correcta
3. Reiniciar la aplicación

```bash
# Verificar permisos
ls -la mars_weather.db
chmod 664 mars_weather.db
```

### Logs y Debugging

**Activar logs detallados:**

```bash
NODE_ENV=development npm run start:dev
```

**Verificar estado de la aplicación:**

```bash
# Health check básico
curl http://localhost:3000/api/weather-data?limit=1

# Verificar logs en tiempo real
tail -f logs/application.log
```

### Comandos de Diagnóstico

```bash
# 1. Verificar conectividad básica
curl -I http://localhost:3000

# 2. Test de endpoints principales
curl http://localhost:3000/api/weather-data?limit=1
curl -X POST http://localhost:3000/api/nasa-api/fetch

# 3. Test de IA (respuesta rápida)
curl -X POST http://localhost:3000/api/ai-assistant/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "Test"}'

# 4. Verificar base de datos
sqlite3 mars_weather.db "SELECT COUNT(*) FROM mars_weather;"
```

---

## Contribución y Desarrollo

### Arquitectura del Proyecto

```
src/
├── app.module.ts           # Módulo principal
├── main.ts                 # Punto de entrada
├── database/              # Configuración de base de datos
├── modules/
│   ├── nasa-api/          # Integración NASA
│   ├── weather-data/      # Gestión de datos
│   └── ai-assistant/      # IA y consultas
└── shared/                # Utilidades compartidas
```

### Scripts Disponibles

```bash
npm run start:dev          # Desarrollo con hot reload
npm run start:prod         # Producción
npm run build              # Compilar TypeScript
npm run lint               # Verificar código
npm run test               # Ejecutar pruebas
```

### Variables de Entorno

| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `NASA_API_KEY` | Clave de API de NASA | Sí |
| `OPENAI_API_KEY` | Clave de API de OpenAI | Sí |
| `DATABASE_PATH` | Ruta de la base de datos | No |
| `PORT` | Puerto del servidor | No |
| `NODE_ENV` | Entorno de ejecución | No |

---

## Ejemplos de Uso Avanzado

### Consultas Avanzadas con Análisis

**1. Análisis Estadístico Completo**

Obtiene estadísticas generales de temperatura, presión y viento de todos los registros disponibles.

```bash
curl -s "http://localhost:3000/api/weather-data" | jq '{
  estadisticas: {
    total_sols: (.data | length),
    temperatura: {
      promedio: ((.data | map(.averageTemperature) | add) / (.data | length)),
      minima_absoluta: (.data | map(.minTemperature) | min),
      maxima_absoluta: (.data | map(.maxTemperature) | max),
      rango_total: ((.data | map(.maxTemperature) | max) - (.data | map(.minTemperature) | min))
    },
    presion: {
      promedio: ((.data | map(.pressure) | add) / (.data | length)),
      minima: (.data | map(.pressure) | min),
      maxima: (.data | map(.pressure) | max)
    },
    viento: {
      velocidad_promedio: ((.data | map(.windSpeed) | add) / (.data | length)),
      velocidad_maxima: (.data | map(.windSpeed) | max)
    }
  }
}'
```

**Respuesta esperada:**
```json
{
  "estadisticas": {
    "total_sols": 7,
    "temperatura": {
      "promedio": -62.437,
      "minima_absoluta": -96.872,
      "maxima_absoluta": -4.444,
      "rango_total": 92.428
    },
    "presion": {
      "promedio": 746.309,
      "minima": 743.55,
      "maxima": 750.563
    },
    "viento": {
      "velocidad_promedio": 6.658,
      "velocidad_maxima": 7.887
    }
  }
}
```

**2. Análisis de Variabilidad Térmica por Sol**

Identifica los Soles con mayor variación de temperatura (diferencia entre máxima y mínima).

```bash
curl -s "http://localhost:3000/api/weather-data" | jq '
.data | map({
  sol: .sol,
  fecha: (.earthDate | split("T")[0]),
  variabilidad_termica: (.maxTemperature - .minTemperature),
  temp_promedio: .averageTemperature
}) | sort_by(.variabilidad_termica) | reverse | .[0:5]'
```

**Respuesta esperada:**
```json
[
  {
    "sol": 681,
    "fecha": "2020-10-25",
    "variabilidad_termica": 91.003,
    "temp_promedio": -62.434
  },
  {
    "sol": 678,
    "fecha": "2020-10-22",
    "variabilidad_termica": 88.673,
    "temp_promedio": -62.867
  }
]
```

**3. Distribución y Frecuencia de Direcciones de Viento**

Analiza la distribución de las direcciones de viento predominantes.

```bash
curl -s "http://localhost:3000/api/weather-data" | jq '
.data | map(.windDirection) | group_by(.) | 
map({
  direccion: .[0],
  frecuencia: length,
  porcentaje: ((length * 100) / 7)
}) | sort_by(.frecuencia) | reverse'
```

**Respuesta esperada:**
```json
[
  {
    "direccion": "WNW",
    "frecuencia": 7,
    "porcentaje": 100
  }
]
```

**4. Comparación de Condiciones entre Soles Específicos**

Compara métricas clave entre diferentes Soles para identificar patrones.

```bash
curl -s "http://localhost:3000/api/weather-data?limit=3" | jq '
.data | map({
  sol: .sol,
  condiciones: {
    temperatura_promedio: .averageTemperature,
    amplitud_termica: (.maxTemperature - .minTemperature),
    presion_atmosferica: .pressure,
    intensidad_viento: .windSpeed,
    calidad_temp: (if .temperatureSamples > 150000 then "alta" else "media" end),
    calidad_presion: (if .pressureSamples > 800000 then "alta" else "media" end)
  }
}) | sort_by(.condiciones.temperatura_promedio) | reverse'
```

**Respuesta esperada:**
```json
[
  {
    "sol": 680,
    "condiciones": {
      "temperatura_promedio": -61.789,
      "amplitud_termica": 81.513,
      "presion_atmosferica": 743.99,
      "intensidad_viento": 6.517,
      "calidad_temp": "alta",
      "calidad_presion": "alta"
    }
  },
  {
    "sol": 681,
    "condiciones": {
      "temperatura_promedio": -62.434,
      "amplitud_termica": 91.003,
      "presion_atmosferica": 743.55,
      "intensidad_viento": 5.632,
      "calidad_temp": "alta",
      "calidad_presion": "alta"
    }
  }
]
```

**5. Análisis de Correlación Presión-Temperatura**

Examina la relación entre presión atmosférica y temperatura promedio.

```bash
curl -s "http://localhost:3000/api/weather-data" | jq '
.data | map({
  sol: .sol,
  temp: .averageTemperature,
  presion: .pressure,
  ratio: (.pressure / (-.averageTemperature))
}) | sort_by(.temp) | map(select(.temp and .presion))'
```

**Respuesta esperada:**
```json
[
  {
    "sol": 677,
    "temp": -63.056,
    "presion": 748.698,
    "ratio": 11.877
  },
  {
    "sol": 675,
    "temp": -62.314,
    "presion": 750.563,
    "ratio": 12.046
  }
]
```

**6. Identificación de Condiciones Óptimas para Operaciones**

Identifica los Soles con las mejores condiciones para operaciones robóticas (temperatura menos extrema, presión estable, viento moderado).

```bash
curl -s "http://localhost:3000/api/weather-data" | jq '
.data | map({
  sol: .sol,
  fecha: (.earthDate | split("T")[0]),
  score_operacional: (
    (if .averageTemperature > -65 then 3 else 1 end) +
    (if .pressure > 745 then 2 else 1 end) +
    (if .windSpeed < 7 then 2 else 1 end) +
    (if (.maxTemperature - .minTemperature) < 85 then 2 else 1 end)
  ),
  condiciones: {
    temp_promedio: .averageTemperature,
    presion: .pressure,
    viento: .windSpeed,
    estabilidad_termica: (.maxTemperature - .minTemperature)
  }
}) | sort_by(.score_operacional) | reverse | .[0:3]'
```

**Respuesta esperada:**
```json
[
  {
    "sol": 680,
    "fecha": "2020-10-24",
    "score_operacional": 9,
    "condiciones": {
      "temp_promedio": -61.789,
      "presion": 743.99,
      "viento": 6.517,
      "estabilidad_termica": 81.513
    }
  },
  {
    "sol": 676,
    "fecha": "2020-10-20",
    "score_operacional": 8,
    "condiciones": {
      "temp_promedio": -62.677,
      "presion": 746.895,
      "viento": 6.654,
      "estabilidad_termica": 87.342
    }
  }
]
```

**7. Análisis de Calidad de Datos por Sensor**

Evalúa la calidad y confiabilidad de las mediciones basándose en el número de muestras.

```bash
curl -s "http://localhost:3000/api/weather-data?limit=5" | jq '
.data | map({
  sol: .sol,
  calidad_mediciones: {
    temperatura: {
      muestras: .temperatureSamples,
      confiabilidad: (if .temperatureSamples > 150000 then "muy_alta" elif .temperatureSamples > 100000 then "alta" else "media" end)
    },
    presion: {
      muestras: .pressureSamples,
      confiabilidad: (if .pressureSamples > 800000 then "muy_alta" elif .pressureSamples > 500000 then "alta" else "media" end)
    },
    viento: {
      muestras: .windSpeedSamples,
      confiabilidad: (if .windSpeedSamples > 80000 then "muy_alta" elif .windSpeedSamples > 50000 then "alta" else "media" end)
    }
  }
}) | sort_by(.sol)'
```

**Respuesta esperada:**
```json
[
  {
    "sol": 675,
    "calidad_mediciones": {
      "temperatura": {
        "muestras": 177556,
        "confiabilidad": "muy_alta"
      },
      "presion": {
        "muestras": 887776,
        "confiabilidad": "muy_alta"
      },
      "viento": {
        "muestras": 88628,
        "confiabilidad": "muy_alta"
      }
    }
  }
]
```

**8. Exportación Científica Formato CSV**

Genera un dataset completo en formato CSV para análisis externos.

```bash
curl -s "http://localhost:3000/api/weather-data" | jq -r '
["Sol","Fecha_Terrestre","Estacion","Temp_Promedio","Temp_Min","Temp_Max","Amplitud_Termica","Presion","Viento_Velocidad","Viento_Direccion","Muestras_Temp","Muestras_Presion","Muestras_Viento"],
(.data[] | [
  .sol,
  (.earthDate | split("T")[0]),
  .season,
  .averageTemperature,
  .minTemperature,
  .maxTemperature,
  (.maxTemperature - .minTemperature),
  .pressure,
  .windSpeed,
  .windDirection,
  .temperatureSamples,
  .pressureSamples,
  .windSpeedSamples
]) | @csv' > mars_weather_complete.csv && echo "Archivo CSV generado: mars_weather_complete.csv"
```

**Respuesta esperada:**
```
Sol,Fecha_Terrestre,Estacion,Temp_Promedio,Temp_Min,Temp_Max,Amplitud_Termica,Presion,Viento_Velocidad,Viento_Direccion,Muestras_Temp,Muestras_Presion,Muestras_Viento
681,"2020-10-25","fall",-62.434,-95.447,-4.444,91.003,743.55,5.632,"WNW",177556,887776,88628
680,"2020-10-24","fall",-61.789,-97.302,-15.798,81.513,743.99,6.517,"WNW",177556,887776,88628
```

**9. Monitoreo de Tendencias Temporales**

Analiza la evolución temporal de las condiciones meteorológicas.

```bash
curl -s "http://localhost:3000/api/weather-data" | jq '
.data | sort_by(.sol) | map({
  sol: .sol,
  fecha: (.earthDate | split("T")[0]),
  tendencia: {
    temperatura: .averageTemperature,
    presion: .pressure,
    viento: .windSpeed
  }
}) | . as $data | map(. + {
  cambio_temp: (if (.sol - 675) > 0 then (.tendencia.temperatura - $data[0].tendencia.temperatura) else 0 end),
  cambio_presion: (if (.sol - 675) > 0 then (.tendencia.presion - $data[0].tendencia.presion) else 0 end)
})'
```

**Respuesta esperada:**
```json
[
  {
    "sol": 675,
    "fecha": "2020-10-19",
    "tendencia": {
      "temperatura": -62.314,
      "presion": 750.563,
      "viento": 7.233
    },
    "cambio_temp": 0,
    "cambio_presion": 0
  },
  {
    "sol": 676,
    "fecha": "2020-10-20",
    "tendencia": {
      "temperatura": -62.677,
      "presion": 746.895,
      "viento": 6.654
    },
    "cambio_temp": -0.363,
    "cambio_presion": -3.668
  }
]
```


