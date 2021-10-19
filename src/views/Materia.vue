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

        <div class="column is-one-quarter" v-for="(m,i) in data" :key="i">
          <div class="box">

            <div class="field is-grouped is-grouped-centered">
              <div class="control">
                <h3 class="title is-3">{{m.materia}}</h3>
                <p class="subtitle is-5 has-text-centered">{{m.descripcion}}</p>
              </div>
            </div>

            <div class="field is-grouped is-grouped-centered">
              <p class="control">
                <a class="button is-primary" @click="loadEntity(m)">
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
                    <b-field label="Nombre">
                      <b-input name="nombre" v-model="materia.materia"></b-input>
                    </b-field>
                  </section>
                  <section class="modal-card-body">
                    <b-field label="Descripción">
                      <b-input name="descripcion" v-model="materia.descripcion"></b-input>
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

const { VUE_APP_API_BASE_URL }  = process.env;

const API_PATH = "/materia";

export default {
  name: 'Materia',
  data() {
      return {
      isComponentModalActive: false,
      insert: false,
      data:[],
      materia: {
        id: 0,
        materia: '',
        descripcion: ''
      }
    }
  },
  methods: {
    submit(props){

      let request ;

      if ( this.materia.id != 0 )
        request = this.axios.put(VUE_APP_API_BASE_URL + API_PATH, this.materia, {params:{id:this.materia.id}})
      else
        request = this.axios.post(VUE_APP_API_BASE_URL + API_PATH, this.materia)
      
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
      
      this.materia = {
        id: 0,
        materia: '',
        descripcion: ''
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
      this.materia = {...item};
    }
  },
  mounted () {
    this.loadData();
  },
}
</script>
