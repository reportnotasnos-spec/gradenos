let studentsData = [];
let csvData = [];
let selectedGrade = 'grade1';
let updatedData = [];

async function loadStudentsData() {
  try {
    const response = await fetch('students_grades.json');
    studentsData = await response.json();
    document.getElementById('currentCount').textContent = studentsData.length;
  } catch (error) {
    console.error('Error cargando datos:', error);
    alert('Error al cargar students_grades.json');
  }
}

function parseCSV(text) {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

  const dniIndex = headers.findIndex(h => h === 'dni');
  const notaIndex = headers.findIndex(h => h === 'nota' || h === 'grade' || h === 'calificacion');

  if (dniIndex === -1 || notaIndex === -1) {
    throw new Error('El CSV debe tener columnas "dni" y "nota"');
  }

  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    if (values[dniIndex] && values[notaIndex] !== '') {
      data.push({
        dni: values[dniIndex],
        nota: parseInt(values[notaIndex], 10)
      });
    }
  }

  return data;
}

function findStudentByDni(dni) {
  return studentsData.filter(s => s.dni === dni);
}

function generatePreview() {
  const tbody = document.getElementById('previewBody');
  tbody.innerHTML = '';

  let matched = 0;
  let notFound = 0;

  csvData.forEach(record => {
    const students = findStudentByDni(record.dni);

    if (students.length > 0) {
      students.forEach(student => {
        matched++;
        const currentGrade = student[selectedGrade];
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${record.dni}</td>
          <td>${student.student}</td>
          <td>${student.program}</td>
          <td>${currentGrade !== undefined ? currentGrade : '-'}</td>
          <td><strong>${record.nota}</strong></td>
          <td class="status-updated">Actualizar</td>
        `;
        tbody.appendChild(row);
      });
    } else {
      notFound++;
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${record.dni}</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>${record.nota}</td>
        <td class="status-not-found">No encontrado</td>
      `;
      tbody.appendChild(row);
    }
  });

  document.getElementById('totalRecords').textContent = csvData.length;
  document.getElementById('matchedRecords').textContent = matched;
  document.getElementById('notFoundRecords').textContent = notFound;

  document.getElementById('previewSection').style.display = 'block';
  document.getElementById('resultSection').style.display = 'none';
}

function applyChanges() {
  updatedData = JSON.parse(JSON.stringify(studentsData));

  let updatedCount = 0;

  csvData.forEach(record => {
    updatedData.forEach(student => {
      if (student.dni === record.dni) {
        student[selectedGrade] = record.nota;
        updatedCount++;
      }
    });
  });

  document.getElementById('previewSection').style.display = 'none';
  document.getElementById('resultSection').style.display = 'block';

  console.log(`${updatedCount} registros actualizados`);
}

function downloadJSON(data, filename) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function downloadTemplate() {
  const uniqueDnis = [...new Set(studentsData.map(s => s.dni))];
  let csv = 'dni,nota\n';
  uniqueDnis.forEach(dni => {
    csv += `${dni},\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `plantilla_${selectedGrade}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadStudentsData();

  // Grade type selector
  document.querySelectorAll('input[name="gradeType"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      selectedGrade = e.target.value;
      if (csvData.length > 0) {
        generatePreview();
      }
    });
  });

  // CSV file input
  document.getElementById('csvFile').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    document.getElementById('fileName').textContent = file.name;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        csvData = parseCSV(event.target.result);
        generatePreview();
      } catch (error) {
        alert('Error al procesar CSV: ' + error.message);
      }
    };
    reader.readAsText(file);
  });

  // Download template
  document.getElementById('btnTemplate').addEventListener('click', downloadTemplate);

  // Apply changes
  document.getElementById('btnApply').addEventListener('click', applyChanges);

  // Cancel
  document.getElementById('btnCancel').addEventListener('click', () => {
    document.getElementById('previewSection').style.display = 'none';
    document.getElementById('csvFile').value = '';
    document.getElementById('fileName').textContent = 'Ningun archivo seleccionado';
    csvData = [];
  });

  // Download updated JSON
  document.getElementById('btnDownload').addEventListener('click', () => {
    downloadJSON(updatedData, 'students_grades.json');
  });

  // Download current JSON
  document.getElementById('btnDownloadCurrent').addEventListener('click', () => {
    downloadJSON(studentsData, 'students_grades_backup.json');
  });
});
