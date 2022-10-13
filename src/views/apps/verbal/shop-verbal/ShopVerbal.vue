<template>
  <b-card>
    <b-row>
      <b-col cols="12">
        <h4>Shops List</h4>
      </b-col>
    </b-row>
    <b-row>
      <section v-if="shops.length > 1">
        <b-card
          v-for="shop in shops"
          :key="shop.id"
          class="ecommerce-card"
          no-body
        >
          <div class="image item-img text-center">
            <b-link :to="{ name: 'apps-verbal', params: { id: shop.id } }">
              <h2 v-if="!shop.image" class="text-overlay">{{ shop.name }}</h2>
              <b-img
                :alt="`${shop.name}-${shop.id}`"
                :src="shop.image"
                center
                :blank="!shop.image"
                blankColor="#bbb"
                width="600"
                height="300"
                class="card-img-top"
              />
            </b-link>
          </div>
          <b-card-body>
            <div class="item-wrapper"></div>
            <h6 class="item-name">
              <b-link
                class="text-body"
                :to="{
                  name: 'apps-shops-edit',
                  params: { id: shop.id },
                }"
              >
                {{ shop.name }}
              </b-link>
            </h6>
          </b-card-body>
        </b-card>
      </section>
    </b-row>
  </b-card>
</template>

<script>
import {
  BCard,
  BRow,
  BCol,
  BFormInput,
  BButton,
  BTable,
  BMedia,
  BAvatar,
  BCardBody,
  BCardText,
  BFormSpinbutton,
  BImg,
  BLink,
  BBadge,
  BDropdown,
  BDropdownItem,
  BPagination,
  BModal,
  VBModal,
  BFormGroup,
  BForm,
} from "bootstrap-vue";
import vSelect from "vue-select";
import store from "@/store";
import { ref, onUnmounted } from "@vue/composition-api";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import { useToast } from "vue-toastification/composition";

import router from "@/router";

export default {
  directives: {
    "b-modal": VBModal,
  },
  components: {
    BFormGroup,
    BModal,
    BCard,
    BCardText,
    BRow,
    BCol,
    BFormInput,
    BButton,
    BTable,
    BMedia,
    BAvatar,
    BFormSpinbutton,
    BImg,
    BLink,
    BBadge,
    BDropdown,
    BDropdownItem,
    BPagination,
    BForm,
    vSelect,
    BCardBody,
  },
  computed: {},
  methods: {},
  data() {
    return {};
  },
  setup() {
    const toast = useToast();

    const shops = ref([]);

    store
      .dispatch("app-user/fetchSelf")
      .then((response) => {
        shops.value = response.data.shops;

        if (shops.value.length == 1) {
          router.push({
            name: "apps-verbal",
            params: { id: shops.value[0].id },
          });
        }
      })
      .catch((error) => {
        toast({
          component: ToastificationContent,
          position: "top-left",
          props: {
            title: "Error",
            variant: "danger",
            icon: "AlertOctagonIcon",
            text: error.response.data,
          },
        });
      });

    return {
      shops,
    };
  },
};
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}
</style>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
</style>

<style scoped>
.image {
  position: relative;
}

.text-overlay {
  position: absolute;
  padding: 1rem;
  font-size: 3rem;
  font-weight: 700;
  color: rgb(0, 0, 0);

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>