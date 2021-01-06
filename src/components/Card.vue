<template>
  <v-container
    fluid
    fill-height
    >
    <v-row
      align="center"
      justify="center"
      height="100vh"
      >
      <v-col
        :cols="cols ? cols : '12'"
        :sm="sm ? sm : '6'"
        :md="md ? md : '5'"
        :lg="lg ? lg : '4'"
        >
        <v-sheet
          color="grey lighten-5"
          elevation="6"
          >
          <v-card>
            <v-img
              :src="require('@/assets/Flower-Life.jpg')"
              class="white--text align-end"
              >
              <v-card-title

                style="-webkit-text-stroke-width: 1px; -webkit-text-stroke-color: grey"
                >{{title}}</v-card-title>
            </v-img>
          <slot></slot>
          </v-card>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>

export default {
  props: {
    title: String,
    cols: String,
    sm: String,
    md: String,
    lg: String
  },
  data: () => ({}),
  created() {
    console.log(this.$props)
  }
}
</script>
