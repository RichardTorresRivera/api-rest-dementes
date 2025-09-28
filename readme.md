# API - Dementes

API REST básica para la gestión de citas de salud mental

## Entidades

- **Paciente:** Persona que solicita una cita con un psicólogo.

- **Psicólogo:** Profesional de la salud encargado de brindar atención psicológica.

- **Especialidad:** Área de especialización de un psicólogo.

- **Cita:** Registro de la programación de una consulta entre un paciente y un psicólogo.

- **Horario:** Disponibilidad horaria de un psicólogo.

## Endpoints - GET

### Citas

- `/citas`: Obtiene el listado de todas las citas.
- `/citas/:id`: Obtiene la información de una cita específica.
- `/citas/psicologo/:id`: Obtiene las citas asociadas a un psicólogo.
- `/citas/paciente/:id`: Obtiene las citas asociadas a un paciente.

### Especialidades

- `/especialidades`: Lista todas las especialidades disponibles.
- `/especialidades/:id`: Obtiene el nombre y descripción de una especialidad en particular.
- `especialidades/psicologo/:id`: Obtiene las especialidades asociadas a un psicólogo específico.

### Horario

- `/horarios`: Lista el catálogo estático de horarios disponibles.
- `/horarios/:id`: Obtiene la información de un horario específico.
- `/horarios/psicologo/:id`: Obtiene los horarios de disponibilidad de un psicólogo.

### Paciente

- `/pacientes`: Lista a todos los pacientes.
- `/pacientes/:id`: Obtiene la información de un paciente en particular.

### Psicologo

- `/psicologos`: Lista todos los psicólogos con su información completa.
- `/psicologos/:id`: Obtiene la información detallada de un psicólogo, incluyendo especialidades y horarios.
- `/psicologos/perfiles`: Obtiene información básica de todos los psicólogos.
- `/psicologos/perfiles/:id`: Obtiene información básica de un psicólogo en particular.
