<template>    
    <header>
      <b-navbar wrapper-class="container" > 
        <template #brand>
            <b-navbar-item tag="router-link" :to="{ path: '/' }">
                <img
                    src="@/assets/logo.png"
                >
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
<style>

.navbar{
    background-color: #4db6ac;
}

</style>
