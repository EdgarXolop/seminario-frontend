<template>
  <section class="section">
    <b-field grouped position="is-right">
        <b-button
            label="Agregar"
            type="is-success"
            icon-left="account-plus"
            @click="clearEntity(); isComponentModalActive = true"/>
    </b-field>

    <b-table
        :data="data"
        :striped="isStriped"
        :hoverable="isHoverable"
        :loading="isLoading"
        :mobile-cards="hasMobileCards"
        :selected.sync="profesor">

        <b-table-column field="" label="" width="10" numeric >
            <b-button size="is-small" type="is-warning" icon-right="pencil-outline" @click="clearEntity(); isComponentModalActive = true"/>
        </b-table-column>
        <b-table-column field="usuario" label="Usuario" width="40" numeric v-slot="props">
            {{ props.row.usuario }}
        </b-table-column>

        <b-table-column field="nombre" label="Nombre" v-slot="props">
            {{ props.row.nombres + " " + props.row.apellidos }}
        </b-table-column>

        <b-table-column field="telefono" label="Telefono" v-slot="props">
            {{ props.row.telefono }}
        </b-table-column>

        <b-table-column field="email" label="Email" v-slot="props">
            {{ props.row.email }}
        </b-table-column>

        <b-table-column field="domicilio" label="Domicilio" v-slot="props">
            {{ props.row.domicilio }}
        </b-table-column>
        
        <template #empty>
            <div class="has-text-centered">No hay profesores registrados.</div>
        </template>

      </b-table>
      <template>
        <b-modal
            v-model="isComponentModalActive"
            has-modal-card
            trap-focus
            :destroy-on-hide="false"
            aria-role="dialog"
            aria-label="Formulario de profesor"
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
                    <b-field grouped>
                        <b-field label="Nombres" >
                            <b-input
                              v-model="profesor.nombres"
                              required></b-input>
                        </b-field>
                        <b-field label="Apellidos" >
                            <b-input
                              v-model="profesor.apellidos"
                              required></b-input>
                        </b-field>
                    </b-field>
                    <b-field grouped>
                        <b-field label="Telefono" >
                            <b-input 
                              type="number"
                              v-model="profesor.telefono"
                              required></b-input>
                        </b-field>
                        <b-field label="Email" group-multiline>
                            <b-input 
                              type="email"
                              v-model="profesor.email"
                              required></b-input>
                        </b-field>
                    </b-field>

                    <b-field label="Dirección" >
                        <b-input
                              v-model="profesor.domicilio"
                              required></b-input>
                    </b-field>

                    <b-field grouped>
                      <b-field label="Usuario" >
                          <b-input
                              v-model="profesor.usuario"
                              required></b-input>
                      </b-field>
                      <b-field label="Contraseña" >
                          <b-input
                              type="password"
                              v-model="profesor.password"
                              password-reveal
                              required>
                          </b-input>
                      </b-field>
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

const {
  VUE_APP_API_BASE_URL,
  VUE_APP_ID_USUARIO_TIPO_PROFESOR
  }  = process.env;

const API_PATH = "/usuario";

export default {
  name: 'Profesor',
  data() {
      return {
      isComponentModalActive: false,
      isStriped: true,
      isHoverable: true,
      isLoading: true,
      hasMobileCards: true,
      data:[],
      profesor: {
        id:0,
        usuario: '',
        nombres: '',
        apellidos: '',
        telefono: '',
        email: '',
        tipo: VUE_APP_ID_USUARIO_TIPO_PROFESOR,
        domicilio: '',
      }
    }
  },
  methods: {
    submit(props){

      let request ;

      if ( this.profesor.id != 0 )
        request = this.axios.put(VUE_APP_API_BASE_URL + API_PATH, this.profesor, {params:{id:this.profesor.id}})
      else
        request = this.axios.post(VUE_APP_API_BASE_URL + API_PATH, this.profesor)

      request
      .then((response) => {
        this.clearEntity();
        response.statusText;
        props.close();

        this.loadData();
      })
      .catch((error) => {
        console.log(error);
      })

    },
    clearEntity() {
      
      this.profesor = {
        id:0,
        usuario: '',
        nombres: '',
        apellidos: '',
        telefono: '',
        email: '',
        tipo: VUE_APP_ID_USUARIO_TIPO_PROFESOR,
        domicilio: ''
      }

    },
    loadData(){
      this.isLoading = true;
      this.axios.get(VUE_APP_API_BASE_URL + API_PATH, {params:{tipoUsuario:VUE_APP_ID_USUARIO_TIPO_PROFESOR}})
      .then((response) => {
        this.isLoading = false
        this.data = response.data;
      })
      .catch((error) => {
        console.log(error);
      })

    }
  },
  mounted () {
    this.loadData();
  },
}
</script>
