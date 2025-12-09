# Instrucciones para Actualizar Notas

## Requisitos

- Git instalado
- Acceso al repositorio: https://github.com/reportnotasnos-spec/gradenos

## Pasos para actualizar notas

### 1. Preparar el archivo CSV

El archivo CSV debe tener dos columnas:

```csv
dni,nota
01117752,15
60821699,18
75051215,12
```

### 2. Usar la herramienta de administracion

1. Abrir `admin.html` en un navegador (usar servidor local)
2. Seleccionar que nota actualizar: **Nota 1**, **Nota 2** o **Nota 3**
3. Click en "Descargar plantilla CSV" para obtener todos los DNIs
4. Completar las notas en Excel o Google Sheets
5. Guardar como CSV
6. Cargar el archivo CSV en la herramienta
7. Revisar la vista previa de cambios
8. Click en "Aplicar Cambios"
9. Click en "Descargar students_grades.json"

### 3. Reemplazar el archivo JSON

Copiar el archivo descargado `students_grades.json` a la carpeta del proyecto, reemplazando el existente.

### 4. Subir cambios a GitHub

Abrir terminal en la carpeta del proyecto y ejecutar:

```bash
git add students_grades.json
git commit -m "Actualizar notas - [Nota 1/2/3]"
git push
```

## Criterios de calificacion

| Estado | Rango | Color |
|--------|-------|-------|
| Aprobado | >= 13 | Verde |
| Recuperacion | 10 - 12 | Naranja |
| Reprobado | < 10 | Rojo |

## Estructura del proyecto

```
gradenos/
├── index.html          # Pagina de login
├── admin.html          # Herramienta de administracion
├── students_grades.json # Datos de estudiantes
├── css/
│   ├── styles.css      # Estilos principales
│   └── admin.css       # Estilos de admin
└── js/
    ├── scripts.js      # Logica del login y dashboard
    └── admin.js        # Logica de administracion
```

## Servidor local

Para probar localmente (necesario por CORS):

**Con Python:**
```bash
python -m http.server 8000
```

**Con Node.js:**
```bash
npx serve
```

Luego abrir http://localhost:8000 en el navegador.
