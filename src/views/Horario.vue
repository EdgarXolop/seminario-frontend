<template>
  <section class="section ">
    <b-field grouped position="is-right">
        <b-button
            label="Agregar"
            type="is-success"
            icon-left="plus-circle"
            @click="clearEntity(); isComponentModalActive = true"/>
    </b-field>
    <div class="columns is-multiline is-mobile" >

        <div class="column is-one-quarter" v-for="(h,i) in data" :key="i">
          <div class="box">

            <div class="field is-grouped is-grouped-centered">
              <div class="control">
                <h3 class="title is-4">{{h.horaInicio | hourFormat}} - {{h.horaFin | hourFormat}}</h3>
                <p class="subtitle is-5 has-text-centered">{{h.descripcion}}</p>
              </div>
            </div>

            <div class="field is-grouped is-grouped-centered">
              <p class="control">
                <a class="button is-primary" @click="loadEntity(h)">
                  Editar
                </a>
              </p>
            </div>
          </div>
        </div>

    </div>
      <template>
        <b-modal
            v-model="isComponentModalActive"
            has-modal-card
            trap-focus
            :destroy-on-hide="false"
            aria-role="dialog"
            aria-label="Formulario"
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
                    <b-field label="Descripción">
                      <b-input v-model="horario.descripcion" required></b-input>
                    </b-field>
                  </section>
                  <section class="modal-card-body">
                    <b-field label="Hora Inicio">
                      <b-timepicker
                          placeholder="Horario Inicio"
                          hour-format="24"
                          :increment-minutes="10"
                          v-model="horaInicio"
                          inline
                          required>
                      </b-timepicker>
                    </b-field>
                  </section>
                  <section class="modal-card-body">
                    <b-field label="Hora Fin">
                      <b-timepicker
                          placeholder="Horario Fin"
                          hour-format="24"
                          :increment-minutes="10"
                          v-model="horaFin"
                          inline
                          required>
                      </b-timepicker>
                    </b-field>
                  </section>
                  <section class="modal-card-body">
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

const { VUE_APP_API_BASE_URL }  = process.env;

const API_PATH = "/horario";

export default {
  name: 'Horario',
  data() {
      return {
      isComponentModalActive: false,
      insert: false,
      data:[],
      horaFin: new Date('2019-06-11T00:00'),
      horaInicio: new Date('2019-06-11T00:00'),
      horario: {
        id: 0,
        horaFin: '',
        horaInicio: ''
      }
    }
  },
  filters:{
      hourFormat: function (value) {
        if (!value) return ''
        
        return value.match(/([0-9]{2}):([0-9]{2})/g)[0]
      }
  },
  watch: {
    horaInicio: function (newValue) {
      this.horario.horaInicio = `${newValue.getHours()}:${newValue.getMinutes()}`
    },
    horaFin: function (newValue) {
      this.horario.horaFin = `${newValue.getHours()}:${newValue.getMinutes()}`
    }
  },
  methods: {
    submit(props){

      let request ;

      if ( this.horario.id != 0 )
        request = this.axios.put(VUE_APP_API_BASE_URL + API_PATH, this.horario, {params:{id:this.horario.id}})
      else
        request = this.axios.post(VUE_APP_API_BASE_URL + API_PATH, this.horario)
      
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
      
      this.horario = {
        id: 0,
        horaFin: '',
        horaInicio: ''
      }

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

      this.horario = {...item};

      this.horaInicio = new Date(`2019-06-11T${this.horario.horaInicio}`)
      this.horaFin = new Date(`2019-06-11T${this.horario.horaFin}`)
    }
  },
  mounted () {
    this.loadData();
  },
}
</script>
