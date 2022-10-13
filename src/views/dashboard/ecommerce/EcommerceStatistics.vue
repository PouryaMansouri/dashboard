<template>
  <b-card v-if="data" no-body class="card-statistics">
    <b-card-header>
      <b-card-title>{{title}}</b-card-title>
    </b-card-header>
    <b-card-body class="statistics-body">
      <b-row>
        <b-col
          v-for="item in data"
          :key="item.icon"
          xl="3"
          sm="6"
          :class="item.customClass"
        >
          <div class="d-flex flex-wrap">
            <b-button :to="{ name: item.url }" variant="secondary-outline">
              <b-media no-body>
                <b-media-aside class="mr-2">
                  <b-avatar size="48" :variant="item.color">
                    <feather-icon size="24" :icon="item.icon" />
                  </b-avatar>
                </b-media-aside>
                <b-media-body class="my-auto">
                  <h4 class="font-weight-bolder mb-0">
                    {{ item.title }}
                  </h4>
                  <b-card-text class="font-small-3 mb-0">
                    {{ item.subtitle }}
                  </b-card-text>
                </b-media-body>
              </b-media>
            </b-button>
          </div>
        </b-col>
      </b-row>
    </b-card-body>
  </b-card>
</template>

<script>
import {
  BCard,
  BCardHeader,
  BCardTitle,
  BCardText,
  BCardBody,
  BRow,
  BCol,
  BMedia,
  BMediaAside,
  BAvatar,
  BMediaBody,
  BButton,
} from "bootstrap-vue";

export default {
  components: {
    BRow,
    BCol,
    BCard,
    BCardHeader,
    BCardTitle,
    BCardText,
    BCardBody,
    BMedia,
    BAvatar,
    BMediaAside,
    BMediaBody,
    BButton,
  },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: "",
    },
  },
};
</script>
