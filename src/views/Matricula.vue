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
        :selected.sync="matricula">

        <b-table-column field="" label="" width="50" v-slot="props">
            <b-button size="is-small" type="is-warning" icon-right="pencil-outline" @click="modfy(props.row)"/>
        </b-table-column>
        <b-table-column field="fechaIngreso" label="Fecha Ingreso" width="300" numeric v-slot="props">
            {{ props.row.fechaIngreso | formatoFecha }}
        </b-table-column>

        <b-table-column field="fechaEgreso" label="Fecha Egreso" width="300" v-slot="props">
            {{ props.row.fechaEgreso | formatoFecha }}
        </b-table-column>

        <b-table-column field="alumno" label="Alumno" width="600" v-slot="props">
            {{ props.row.alumno.nombres }} {{ props.row.alumno.apellidos }}
        </b-table-column>

        <b-table-column field="nota" label="Nota" width="600" v-slot="props">
            {{ props.row.nota }}
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


                    <b-field label="Fecha Ingreso" horizontal >
                      <b-datepicker
                        v-model="dFI"
                        name="fechaIngreso"
                        locale="es-MX"
                        placeholder="Click to select..."
                        icon="calendar-today"
                        icon-right-clickable
                        @icon-right-click="clearDateFI"
                        trap-focus>
                      </b-datepicker>
                    </b-field>

                    <b-field label="Fecha Egreso" horizontal >
                      <b-datepicker
                        v-model="dFE"
                        name="fechaEgreso"
                        locale="es-MX"
                        placeholder="Click to select..."
                        :min-date="dFI"
                        icon="calendar-today"
                        icon-right-clickable
                        @icon-right-click="clearDateFE"
                        trap-focus>
                      </b-datepicker>
                    </b-field>

                    <b-field label="Alumno" horizontal :type="{ 'is-danger': matricula.idAlumno == 0 }">
                        <b-autocomplete
                            v-model="alumno"
                            name="alumno"
                            ref="autocomplete"
                            :data="alumnoData"
                            :select-on-click-outside="true"
                            :keep-first="true"
                            field="fullname"
                            @typing="loadAlumno"
                            @select="option => matricula.idAlumno = option.id">
                            <template #empty>No hay resultados para {{alumno}}</template>
                        </b-autocomplete>
                    </b-field>

                    <b-field label="Descripción" horizontal>
                        <b-input nombre="descripcion" maxlength="100" type="textarea" v-model="matricula.nota"></b-input>
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

const { VUE_APP_API_BASE_URL,VUE_APP_ID_USUARIO_TIPO_ALUMNO }  = process.env;

const API_PATH = "/matricula";
const API_PATH_GRADO = "/usuario?tipoUsuario=" + VUE_APP_ID_USUARIO_TIPO_ALUMNO;

export default {
  name: 'Matricula',
  data() {
      return {
      isComponentModalActive: false,
      isStriped: true,
      isHoverable: true,
      isLoading: true,
      hasMobileCards: true,
      alumno:"",
      data:[],
      alumnoData:[],
      dFI: new Date(),
      dFE: new Date(),
      matricula: {
        id: 0, 
        fechaIngreso: '',
        fechaEgreso: '',
        idAlumno:0,
        nota: '',
        ao: 0
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

      this.matricula.fechaIngreso = moment(this.dFI).format('YYYY-MM-DD');
      this.matricula.fechaEgreso = moment(this.dFE).format('YYYY-MM-DD');

      if ( this.matricula.id != 0 )
        request = this.axios.put(VUE_APP_API_BASE_URL + API_PATH, this.matricula, {params:{id:this.matricula.id}})
      else
        request = this.axios.post(VUE_APP_API_BASE_URL + API_PATH, this.matricula)
      
      request
      .then((response) => {
        response.statusText;
        props.close();
        this.clearEntity();
        this.loadData()
      })
      .catch((error) => {
        console.log(error);
      })

    },
    clearEntity() {
      
      this.curso = {
        id: 0, 
        fechaIngreso: '',
        fechaEgreso: '',
        idAlumno:0,
        nota: '',
        ao: 0
      }

      this.alumno = ''

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
    loadAlumno: debounce(function(option) {

        this.axios.get(VUE_APP_API_BASE_URL + API_PATH_GRADO)
        .then((response) => {
            
            this.alumnoData = response.data.map( function(e){ e.fullname = ( e.nombres + " " + e.apellidos ); return e; } ).filter(e => { return e.fullname.toLowerCase().indexOf(option.toLowerCase()) != -1 });
        })
        .catch((error) => {
            console.log(error);
        })
    },200),
    clearDateFI () {
        this.matricula.fechaIngreso = null
    },
    clearDateFE () {
        this.matricula.fechaEgreso = null
    },
    modfy(item){
      this.clearEntity(); 
      this.isComponentModalActive = true;
      this.alumno = item.alumno.nombres + " " + item.alumno.apellidos

      this.dFI = new Date(item.fechaIngreso);
      this.dFE = new Date(item.fechaEgreso);

    }
  },
  mounted () {
    this.loadData();

  },
}
</script>
