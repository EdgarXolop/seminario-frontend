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
        :selected.sync="matricula_curso">

        <b-table-column field="" label="" width="50" v-slot="props">
            <b-button size="is-small" type="is-warning" icon-right="pencil-outline" @click="modfy(props.row)"/>
        </b-table-column>
        
        <b-table-column field="id" label="No." v-slot="props">
            {{ props.row.id }}
        </b-table-column>

        <b-table-column field="alumno" label="Alumno" width="600" v-slot="props">
            {{ props.row.matricula.alumno.nombres }} {{ props.row.matricula.alumno.apellidos }}
        </b-table-column>

        <b-table-column field="curso" label="Curso" width="600" v-slot="props">
            {{ props.row.curso.curso }}
        </b-table-column>

        <b-table-column field="notas" label="Notas" width="600" v-slot="props">
            {{ props.row.notas }}
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

                    <b-field label="Curso" horizontal :type="{ 'is-danger': matricula_curso.idCurso == 0 }">
                        <b-autocomplete
                            name="curso"
                            v-model="curso"
                            ref="autocomplete"
                            :data="cursoData"
                            :select-on-click-outside="true"
                            :keep-first="true"
                            field="curso"
                            @typing="loadCurso"
                            @select="option => matricula_curso.idCurso = option.id">
                            <template #empty>No hay resultados para {{curso}}</template>
                        </b-autocomplete>
                    </b-field>

                    <b-field label="Matricula" horizontal :type="{ 'is-danger': matricula_curso.idMatricula == 0 }">
                        <b-autocomplete
                            name="matricula"
                            v-model="matricula"
                            ref="autocomplete"
                            :data="matriculaData"
                            :select-on-click-outside="true"
                            :keep-first="true"
                            field="fullname"
                            @typing="loadMatricula"
                            @select="option => matricula_curso.idMatricula = option.id">
                            <template #empty>No hay resultados para {{matricula}}</template>
                        </b-autocomplete>
                    </b-field>

                    <b-field label="Notas" horizontal>
                        <b-input nombre="notas" maxlength="100" type="textarea" v-model="matricula_curso.notas"></b-input>
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
import moment from 'moment';
import { debounce } from "debounce";

const { VUE_APP_API_BASE_URL }  = process.env;

const API_PATH = "/matricula_curso";
const API_PATH_CURSO = "/curso";
const API_PATH_MATRICULA = "/matricula";

export default {
  name: 'Matricula',
  data() {
      return {
      isComponentModalActive: false,
      isStriped: true,
      isHoverable: true,
      isLoading: true,
      hasMobileCards: true,
      curso:"",
      matricula:"",
      data:[],
      cursoData:[],
      matriculaData:[],
      matricula_curso: {
        id: 0, 
        idMatricula: '',
        idCurso: '',
        nota: ''
      }
    }
  },
  filters:{
    formatoFecha(value){
      if(!value) return ''

      return moment(value).format('DD/MM/YYYY');
    }    
  },
  methods: {
    submit(props){

      let request ;


      if ( this.matricula_curso.id != 0 )
        request = this.axios.put(VUE_APP_API_BASE_URL + API_PATH, this.matricula_curso, {params:{id:this.matricula_curso.id}})
      else
        request = this.axios.post(VUE_APP_API_BASE_URL + API_PATH, this.matricula_curso)
      
      request
      .then((response) => {
        response.statusText;
        props.close();

        this.loadData()
      })
      .catch((error) => {
        console.log(error);
      })

    },
    clearEntity() {
      
      this.matricula_curso = {
        id: 0, 
        idMatricula: '',
        idCurso: '',
        notas: ''
      }

      this.curso = ''
      this.matricula = ''

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
    loadCurso: debounce(function(option) {

        this.axios.get(VUE_APP_API_BASE_URL + API_PATH_CURSO)
        .then((response) => {
            
            this.cursoData = response.data.filter(e => { return e.curso.toLowerCase().indexOf(option.toLowerCase()) != -1 });
            
        })
        .catch((error) => {
            console.log(error);
        })
    },200),

    loadMatricula: debounce(function(option) {

        this.axios.get(VUE_APP_API_BASE_URL + API_PATH_MATRICULA)
        .then((response) => {
            
            this.matriculaData = response.data.map( function(e){ e.fullname = ( e.alumno.nombres + " " + e.alumno.apellidos ); return e; } ).filter(e => { return e.fullname.toLowerCase().indexOf(option.toLowerCase()) != -1 });
            
        })
        .catch((error) => {
            console.log(error);
        })
    },200),
    modfy(item){
      this.clearEntity(); 
      this.isComponentModalActive = true;
      this.matricula = item.matricula.alumno.nombres + " " + item.matricula.alumno.apellidos
      this.curso = item.curso.curso
    }
  },
  mounted () {
    this.loadData();

  },
}
</script>
