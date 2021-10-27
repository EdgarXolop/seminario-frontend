<template>
    <section class="section">
        <b-menu >
            <b-menu-list label="Menu" >
                <b-menu-item icon="information-outline" label="Info"></b-menu-item>
                <b-menu-item icon="account-multiple" type="is-primary">
                    <template #label="props">
                        Usuarios
                        <b-icon class="is-pulled-right" :icon="props.expanded ? 'menu-up' : 'menu-down'"></b-icon>
                    </template>
                    <b-menu-item icon="account" label="Alumno" tag="router-link" :to="{ path: '/alumno' }"></b-menu-item>
                    <b-menu-item icon="account" label="Profesor" tag="router-link" :to="{ path: '/profesor' }"></b-menu-item>
                    <b-menu-item icon="account" label="Administrativo" tag="router-link" :to="{ path: '/administrativo' }"></b-menu-item>
                </b-menu-item>

                <b-menu-item icon="account-multiple">
                    <template #label="props">
                        Areas y Contenido
                        <b-icon class="is-pulled-right" :icon="props.expanded ? 'menu-up' : 'menu-down'"></b-icon>
                    </template>
                    <b-menu-item label="Carreras" tag="router-link" :to="{ path: '/carrera' }"></b-menu-item>
                    <b-menu-item label="Grados" tag="router-link" :to="{ path: '/grado' }"></b-menu-item>
                    <b-menu-item label="Secciones" tag="router-link" :to="{ path: '/seccion' }"></b-menu-item>
                    <b-menu-item label="Materias" tag="router-link" :to="{ path: '/materia' }"></b-menu-item>
                    <b-menu-item label="Horarios" tag="router-link" :to="{ path: '/horario' }"></b-menu-item>
                </b-menu-item>
                
                <b-menu-item icon="book" label="Cursos" tag="router-link" :to="{ path: '/curso' }"></b-menu-item>
                <b-menu-item icon="clipboard-text" label="Clases" tag="router-link" :to="{ path: '/clase' }"></b-menu-item>
                <b-menu-item icon="bookmark-plus-outline" label="Matriculación" tag="router-link" :to="{ path: '/matricula' }"></b-menu-item>
                <b-menu-item icon="link-plus" label="Asignaciones" tag="router-link" :to="{ path: '/matriculacurso' }"></b-menu-item>

                <b-menu-item icon="currency-usd">
                    <template #label="props">
                        Pagos
                        <b-icon class="is-pulled-right" :icon="props.expanded ? 'menu-up' : 'menu-down'"></b-icon>
                    </template>
                    <b-menu-item label="Tipos de Pagos" tag="router-link" :to="{ path: '/tipopago' }"></b-menu-item>
                    <b-menu-item label="Realizar Pago" tag="router-link" :to="{ path: '/pago' }"></b-menu-item>
                </b-menu-item>
            </b-menu-list>
            <b-menu-list label="Aciones">
                <b-menu-item label="Salir"></b-menu-item>
            </b-menu-list>
        </b-menu>
    </section>
</template>

<script>
export default {
  data() {
    return {
      isActive: true
    }
  }
}
</script>