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
        :selected.sync="curso_materia">

        <b-table-column field="" label="" numeric >
            <b-button size="is-small" type="is-warning" icon-right="pencil-outline" @click="clearEntity(); isComponentModalActive = true"/>
        </b-table-column>

        <b-table-column field="curso" label="Curso" numeric v-slot="props">
            {{ props.row.curso.curso }}
        </b-table-column>

        <b-table-column field="materia" label="Materia"  v-slot="props">
            {{ props.row.materia.materia}}
        </b-table-column>

        <b-table-column field="horario" label="Horario" v-slot="props">
            {{ props.row.horario.horaInicio | hourFormat }} - {{ props.row.horario.horaFin | hourFormat }}
        </b-table-column>

        <b-table-column field="profesor" label="Profesor" v-slot="props">
            {{ props.row.profesor.nombres }} {{ props.row.profesor.apellidos }}
        </b-table-column>

        <b-table-column field="descripcion" label="Descripcion" v-slot="props">
            {{ props.row.descripcion }}
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

                    <b-field label="Curso" horizontal :type="{ 'is-danger': curso_materia.idCurso == 0 }">
                        <b-autocomplete
                            name="curso"
                            v-model="curso"
                            ref="autocomplete"
                            :data="cursoData"
                            :select-on-click-outside="true"
                            :keep-first="true"
                            field="curso"
                            @typing="loadCurso"
                            @select="option => curso_materia.idCurso = option.id">
                            <template #empty>No hay resultados para {{curso}}</template>
                        </b-autocomplete>
                    </b-field>

                    <b-field label="Materia" horizontal :type="{ 'is-danger': curso_materia.idMateria == 0 }">
                        <b-autocomplete
                            name="materia"
                            v-model="materia"
                            ref="autocomplete"
                            :data="materiaData"
                            :select-on-click-outside="true"
                            :keep-first="true"
                            field="materia"
                            @typing="loadMateria"
                            @select="option => curso_materia.idMateria = option.id">
                            <template #empty>No hay resultados para {{materia}}</template>
                        </b-autocomplete>
                    </b-field>

                    <b-field label="Horario" horizontal :type="{ 'is-danger': curso_materia.idHorario == 0 }">
                        <b-autocomplete
                            name="horario"
                            v-model="horario"
                            ref="autocomplete"
                            :data="horarioData"
                            :select-on-click-outside="true"
                            :keep-first="true"
                            field="horario"
                            @typing="loadHorario"
                            @select="option => curso_materia.idHorario = option.id">
                            <template #empty>No hay resultados para {{horario}}</template>
                            <template slot-scope="props">
                              <div class="content is-normal">
                                {{props.option.horaInicio}} - {{props.option.horaFin}} | 
                                <small>{{props.option.descripcion}}</small>
                              </div>
                            </template>
                        </b-autocomplete>
                    </b-field>

                    <b-field label="Profesor" horizontal :type="{ 'is-danger': curso_materia.idProfesor == 0 }">
                        <b-autocomplete
                            name="profesor"
                            v-model="profesor"
                            ref="autocomplete"
                            :data="profesorData"
                            :select-on-click-outside="true"
                            :keep-first="true"
                            field="nombres"
                            @typing="loadProfesor"
                            @select="option => curso_materia.idProfesor = option.id">
                            <template #empty>No hay resultados para {{profesor}}</template>
                            <template slot-scope="props">{{props.option.nombres}} {{props.option.apellidos}}</template>
                        </b-autocomplete>
                    </b-field>

                    <b-field label="Descripción" horizontal>
                        <b-input name="descripcion" maxlength="100" type="textarea" v-model="curso_materia.descripcion"></b-input>
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

const { 
  VUE_APP_API_BASE_URL,
  VUE_APP_ID_USUARIO_TIPO_PROFESOR
}  = process.env;

const API_PATH = "/curso_materia";
const API_PATH_CURSO = "/curso";
const API_PATH_MATERIA = "/materia";
const API_PATH_HORARIO = "/horario";
const API_PATH_PROFESOR = "/usuario?tipoUsuario="+ VUE_APP_ID_USUARIO_TIPO_PROFESOR;

export default {
  name: 'Curso',
  data() {
      return {
      isComponentModalActive: false,
      isStriped: true,
      isHoverable: true,
      isLoading: true,
      hasMobileCards: true,
      curso:"",
      materia:"",
      horario:"",
      profesor:"",
      data:[],
      cursoData:[],
      materiaData:[],
      horarioData:[],
      profesorData:[],
      curso_materia: {
        id: 0, 
        idCurso: 0,
        idMateria: 0,
        idHorario:0,
        idProfesor: 0
      }
    }
  },
  filters:{
      hourFormat: function (value) {
        if (!value) return ''
        
        return value.match(/([0-9]{2}):([0-9]{2})/g)[0]
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
      
      this.curso_materia = {
        id: 0, 
        idCurso: 0,
        idMateria: 0,
        idHorario:0,
        idProfesor: 0
      }

      this.curso = ''
      this.materia = ''
      this.horario = ''
      this.profesor = ''

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
    loadCurso: debounce(function(option) {

        this.axios.get(VUE_APP_API_BASE_URL + API_PATH_CURSO)
        .then((response) => {
            
            this.cursoData = response.data.filter(e => { return e.curso.toLowerCase().indexOf(option.toLowerCase()) != -1 });
            
        })
        .catch((error) => {
            console.log(error);
        })
    },200),
    loadMateria: debounce(function(option) {

        this.axios.get(VUE_APP_API_BASE_URL + API_PATH_MATERIA)
        .then((response) => {
            
            this.materiaData = response.data.filter(e => { return e.materia.toLowerCase().indexOf(option.toLowerCase()) != -1 });
            
        })
        .catch((error) => {
            console.log(error);
        })
    },200),
    loadHorario: debounce(function(option) {


        this.axios.get(VUE_APP_API_BASE_URL + API_PATH_HORARIO)
        .then((response) => {
            
            this.horarioData = response.data.filter(e => { 
                                                          return e.descripcion.toLowerCase().indexOf(option.toLowerCase()) != -1 
                                                          || e.horaInicio.toLowerCase().indexOf(option.toLowerCase()) != -1 
                                                          || e.horaFin.toLowerCase().indexOf(option.toLowerCase()) != -1 
                                                        });
            
        })
        .catch((error) => {
            console.log(error);
        })
    },200),
    loadProfesor: debounce(function(option) {


        this.axios.get(VUE_APP_API_BASE_URL + API_PATH_PROFESOR)
        .then((response) => {
            
            this.profesorData = response.data.filter(e => { return e.nombres.toLowerCase().indexOf(option.toLowerCase()) != -1 || e.apellidos.toLowerCase().indexOf(option.toLowerCase()) != -1 });
            
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
