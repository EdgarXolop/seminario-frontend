<template>    
    <header>
      <b-navbar type="is-info" wrapper-class="container"> 
          <template #start>
              <b-navbar-item tag="router-link" :to="{ path: '/' }">
                  Home
              </b-navbar-item>
              <b-navbar-item tag="router-link" :to="{ path: '/alumno' }">
                  Alumnos
              </b-navbar-item>
              <b-navbar-item tag="router-link" :to="{ path: '/administrativo' }">
                  Administrativos
              </b-navbar-item>
              <b-navbar-item tag="router-link" :to="{ path: '/carrera' }">
                  Carreras
              </b-navbar-item>
              <b-navbar-item tag="router-link" :to="{ path: '/grado' }">
                  Grados
              </b-navbar-item>
              <b-navbar-item tag="router-link" :to="{ path: '/seccion' }">
                  Seccion
              </b-navbar-item>
              <b-navbar-item tag="router-link" :to="{ path: '/curso' }">
                  Curso
              </b-navbar-item>
          </template>

          <template #end>
              <b-navbar-item tag="div">
                  <div class="buttons">
                      <a class="button is-info">
                          Ingresar
                      </a>
                  </div>
              </b-navbar-item>
          </template>
      </b-navbar>
    </header>
</template>


<script>

export default {
  name: 'Home'
}
</script>
