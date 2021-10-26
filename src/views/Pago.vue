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
        :selected.sync="pago">

        <b-table-column field="" label="" width="50" v-slot="props">
            <b-button size="is-small" type="is-warning" icon-right="pencil-outline" @click="modfy(props.row)"/>
        </b-table-column>
        
        <b-table-column field="id" label="No." v-slot="props">
            {{ props.row.id }}
        </b-table-column>

        <b-table-column field="alumno" label="Alumno" width="600" v-slot="props">
            {{ props.row.matricula.alumno.nombres }} {{ props.row.matricula.alumno.apellidos }}
        </b-table-column>

        <b-table-column field="tipoPago" label="Tipo de Pago" width="600" v-slot="props">
            {{ props.row.tipoPago.tipoPago }}
        </b-table-column>

        <b-table-column field="monto" label="Monto" width="600" v-slot="props">
            {{ props.row.monto }}
        </b-table-column>

        <b-table-column field="fechaPago" label="Fecha de Pago" width="600" v-slot="props">
            {{ props.row.fechaPago | formatoFecha }}
        </b-table-column>

        <b-table-column field="fechaVencimiento" label="Fecha de Vencimiento" width="600" v-slot="props">
            {{ props.row.fechaVencimiento | formatoFecha }}
        </b-table-column>
        
        <b-table-column field="descripcion" label="descripcion" width="600" v-slot="props">
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

                    <b-field label="Matricula" horizontal :type="{ 'is-danger': pago.idMatricula == 0 }">
                        <b-autocomplete
                            name="matricula"
                            v-model="matricula"
                            ref="autocomplete"
                            :data="matriculaData"
                            :select-on-click-outside="true"
                            :keep-first="true"
                            field="fullname"
                            @typing="loadMatricula"
                            @select="option => pago.idMatricula = option.id">
                            <template #empty>No hay resultados para {{matricula}}</template>
                        </b-autocomplete>
                    </b-field>

                    <b-field label="Tipo de Pago" horizontal>
                        <b-select placeholder="" icon="currency-usd" name="tipo_pago" v-model="pago.idTipoPago">
                            <option :value="tp.id" v-for="(tp,i) in tipo_pagoData" :key="i">{{tp.tipoPago}}</option>
                        </b-select>
                    </b-field>

                    <b-field label="Monto" horizontal>
                        <b-numberinput name="monto" controls-alignment="right" controls-position="compact" v-model="pago.monto" required></b-numberinput>
                    </b-field>


                    <b-field label="Fecha Pago" horizontal >
                      <b-datepicker
                        v-model="fechaPago"
                        name="fechaPago"
                        locale="es-MX"
                        placeholder="Click to select..."
                        icon="calendar-today"
                        trap-focus>
                      </b-datepicker>
                    </b-field>

                    <b-field label="Fecha Vencimiento" horizontal >
                      <b-datepicker
                        v-model="fechaVencimiento"
                        name="fechaVencimiento"
                        :min-date="fechaPago"
                        locale="es-MX"
                        placeholder="Click to select..."
                        icon="calendar-today"
                        trap-focus>
                      </b-datepicker>
                    </b-field>

                    <b-field label="Descripción" horizontal>
                        <b-input nombre="descripcion" maxlength="100" type="textarea" v-model="pago.descripcion"></b-input>
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

const API_PATH = "/pago";
const API_PATH_MATRICULA = "/matricula";
const API_PATH_TIPO_PAGO = "/tipo_pago";

export default {
  name: 'Pago',
  data() {
      return {
      isComponentModalActive: false,
      isStriped: true,
      isHoverable: true,
      isLoading: true,
      hasMobileCards: true,
      matricula:"",
      data:[],
      matriculaData:[],
      tipo_pagoData:[],
      pago: {
        id: 0, 
        idMatricula: 0,
        idTipoPago: 10,
        monto: 0,
        descripcion: '',
        fechaVencimiento: null,
        fechaPago: null
      },
      fechaVencimiento: new Date(),
      fechaPago: new Date()
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

      this.pago.fechaPago = moment(this.fechaPago).format('YYYY-MM-DD');
      this.pago.fechaVencimiento = moment(this.fechaVencimiento).format('YYYY-MM-DD');

      if ( this.pago.id != 0 )
        request = this.axios.put(VUE_APP_API_BASE_URL + API_PATH, this.pago, {params:{id:this.pago.id}})
      else
        request = this.axios.post(VUE_APP_API_BASE_URL + API_PATH, this.pago)
      
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
        idMatricula: 0,
        idTipoPago: 10,
        monto: 0,
        descripcion: '',
        fechaVencimiento: null,
        fechaPago: null
      }

      this.matricula = ''
      this.fechaVencimiento= new Date()
      this.fechaPago= new Date()

      this.loadTipoPago();
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
    loadTipoPago: debounce(function() {

        this.axios.get(VUE_APP_API_BASE_URL + API_PATH_TIPO_PAGO)
        .then((response) => {
            
            this.tipo_pagoData = response.data;
            
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
    }
  },
  mounted () {
    this.loadData();
    this.loadTipoPago();
  },
}
</script>
