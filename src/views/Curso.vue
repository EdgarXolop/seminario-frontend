<template>
  <section class="section ">
    <b-field grouped position="is-right">
        <b-button
            label="Agregar"
            type="is-success"
            icon-left="plus-circle"
            @click="clearEntity(); isComponentModalActive = true"/>
    </b-field>
    
    <b-table
        :data="data"
        :striped="isStriped"
        :hoverable="isHoverable"
        :loading="isLoading"
        :mobile-cards="hasMobileCards"
        :selected.sync="curso">

        <!--b-table-column field="" label="" numeric >
            <b-button size="is-small" type="is-warning" icon-right="pencil-outline" @click="clearEntity(); isComponentModalActive = true"/>
        </b-table-column-->
        <b-table-column field="curso" label="Curso" width="300" numeric v-slot="props">
            {{ props.row.curso }}
        </b-table-column>

        <b-table-column field="descripcion" label="Descripción" width="500" v-slot="props">
            {{ props.row.descripcion}}
        </b-table-column>

        <b-table-column field="grado" label="Grado" v-slot="props">
            {{ props.row.grado.grado }}
        </b-table-column>

        <b-table-column field="carrera" label="Carrera" width="300" v-slot="props">
            {{ props.row.carrera.carrera }}
        </b-table-column>

        <b-table-column field="seccion" label="Sección" width="300" v-slot="props">
            {{ props.row.seccion.seccion }}
        </b-table-column>
        
        <template #empty>
            <div class="has-text-centered">No hay cursos registrados.</div>
        </template>

    </b-table>
      <template>
        <b-modal
            v-model="isComponentModalActive"
            has-modal-card
            trap-focus
            :destroy-on-hide="false"
            aria-role="dialog"
            aria-label="Formulario de alumno"
            aria-modal>
          <template #default="props">
            <form action="" @submit.stop.prevent="submit(props)">
              <div class="modal-card">
                  <header class="modal-card-head">
                      <p class="modal-card-title">Formulario</p>
                      <button
                          type="button"
                          class="delete"
                          @click="props.close()"/>
                  </header>
                  <section class="modal-card-body">
                    <b-field label="Curso" horizontal>
                        <b-input v-model="curso.curso"/>
                    </b-field>

                    <b-field label="Grado" horizontal :type="{ 'is-danger': curso.idGrado == 0 }">
                        <b-autocomplete
                            v-model="grado"
                            ref="autocomplete"
                            :data="gradoData"
                            :select-on-click-outside="true"
                            :keep-first="true"
                            field="grado"
                            @typing="loadGrado"
                            @select="option => curso.idGrado = option.id">
                            <template #empty>No hay resultados para {{grado}}</template>
                        </b-autocomplete>
                    </b-field>

                    <b-field label="Carrera" horizontal :type="{ 'is-danger': curso.idCarrera == 0 }">
                        <b-autocomplete
                            v-model="carrera"
                            ref="autocomplete"
                            :data="carreraData"
                            :select-on-click-outside="true"
                            :keep-first="true"
                            field="carrera"
                            @typing="loadCarrera"
                            @select="option => (curso.idCarrera = option.id)">
                            <template #empty>No hay resultados para {{carrera}}</template>
                        </b-autocomplete>
                    </b-field>

                    <b-field label="Sección" horizontal :type="{ 'is-danger': curso.idSeccion == 0 }">
                        <b-autocomplete
                            v-model="seccion"
                            ref="autocomplete"
                            :data="seccionData"
                            :select-on-click-outside="true"
                            :keep-first="true"
                            field="seccion"
                            @typing="loadSeccion"
                            @select="option => curso.idSeccion = option.id">
                            <template #empty>No hay resultados para {{seccion}}</template>
                        </b-autocomplete>
                    </b-field>

                    <b-field label="Descripción" horizontal>
                        <b-input maxlength="100" type="textarea" v-model="curso.descripcion"></b-input>
                    </b-field>
                  </section>
                  <footer class="modal-card-foot">
                      <b-button
                          label="Cancelar"
                          @click="props.close()"/>
                      <b-button
                          label="Guardar"
                          type="is-primary" 
                          @click.stop.prevent="submit(props)"/>
                  </footer>
              </div>
            </form>
          </template>
        </b-modal>
      </template>
  </section>
</template>

<script>
import { debounce } from "debounce";

const { VUE_APP_API_BASE_URL }  = process.env;

const API_PATH = "/curso";
const API_PATH_GRADO = "/grado";
const API_PATH_CARRERA = "/carrera";
const API_PATH_SECCION = "/seccion";

export default {
  name: 'Curso',
  data() {
      return {
      isComponentModalActive: false,
      isStriped: true,
      isHoverable: true,
      isLoading: true,
      hasMobileCards: true,
      grado:"",
      carrera:"",
      seccion:"",
      data:[],
      gradoSelect: null,
      gradoData:[],
      carreraData:[],
      seccionData:[],
      curso: {
        id: 0, 
        curso: '',
        descripcion: '',
        idSeccion:0,
        idCarrera: 0,
        idGrado: 0, 
        ao: 0
      }
    }
  },
  methods: {
    submit(props){

      let request ;

      if ( this.curso.id != 0 )
        request = this.axios.put(VUE_APP_API_BASE_URL + API_PATH, this.curso, {params:{id:this.curso.id}})
      else
        request = this.axios.post(VUE_APP_API_BASE_URL + API_PATH, this.curso)
      
      request
      .then((response) => {
        this.clearEntity();
        response.statusText;
        props.close();

        this.loadData()
      })
      .catch((error) => {
        console.log(error);
      })

    },
    clearEntity() {
      
      this.curso = {
        id: 0, 
        curso: '',
        descripcion: '',
        idSeccion:0,
        idCarrera: 0,
        idGrado: 0, 
        ao: 0
      }

      this.grado = ''
      this.carrera = ''
      this.seccion = ''

      this.axios.get(VUE_APP_API_BASE_URL + API_PATH_CARRERA)
      .then((response) => {
          
        this.carreraData = response.data;
        
      })
      .catch((error) => {
        console.log(error);
      })


      this.axios.get(VUE_APP_API_BASE_URL + API_PATH_SECCION)
      .then((response) => {
          
        this.seccionData = response.data;
        
      })
      .catch((error) => {
        console.log(error);
      })

    },
    loadData(){
      this.isLoading = true;
      this.axios.get(VUE_APP_API_BASE_URL + API_PATH)
      .then((response) => {
        this.isLoading = false
        this.data = response.data;
        
      })
      .catch((error) => {
        console.log(error);
      })

    },
    loadEntity(item){
      this.isComponentModalActive = true

      this.curso = {...item};
    },
    loadGrado: debounce(function(option) {

        this.axios.get(VUE_APP_API_BASE_URL + API_PATH_GRADO)
        .then((response) => {
            
            this.gradoData = response.data.filter(e => { return e.grado.toLowerCase().indexOf(option.toLowerCase()) != -1 });
            
        })
        .catch((error) => {
            console.log(error);
        })
    },200),
    loadCarrera: debounce(function(option) {

        this.axios.get(VUE_APP_API_BASE_URL + API_PATH_CARRERA)
        .then((response) => {
            
            this.carreraData = response.data.filter(e => { return e.carrera.toLowerCase().indexOf(option.toLowerCase()) != -1 });
            
        })
        .catch((error) => {
            console.log(error);
        })
    },200),
    loadSeccion: debounce(function(option) {


        this.axios.get(VUE_APP_API_BASE_URL + API_PATH_SECCION)
        .then((response) => {
            
            this.seccionData = response.data.filter(e => { return e.seccion.toLowerCase().indexOf(option.toLowerCase()) != -1 });
            
        })
        .catch((error) => {
            console.log(error);
        })
    },200)
  },
  mounted () {
    this.loadData();
  },
}
</script>
