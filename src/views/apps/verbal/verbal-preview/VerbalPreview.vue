<template>
  <section class="invoice-preview-wrapper">
    <b-alert variant="danger" :show="verbal === undefined">
      <h4 class="alert-heading">Error fetching verbal data</h4>
    </b-alert>

    <b-row v-if="verbal" class="invoice-preview">
      <b-col cols="12" xl="9" md="8">
        <b-card id="verbal-card" no-body class="invoice-preview-card">
          <b-card-body class="invoice-padding pb-0">
            <div
              class="
                d-flex
                justify-content-between
                flex-md-row flex-column
                invoice-spacing
                mt-0
              "
            >
              <div class="mt-md-0 mt-2">
                <h4 class="invoice-title">
                  Invoice
                  <span class="invoice-number">#{{ "ddd" }}</span>
                </h4>
                <div class="invoice-date-wrapper">
                  <p class="invoice-date-title">Date Issued:</p>
                  <p class="invoice-date">
                    {{ new Date() }}
                  </p>
                </div>
              </div>
            </div>
          </b-card-body>

          <hr class="invoice-spacing" />

          <b-table-lite
            responsive
            :items="verbal.cart"
            :fields="[
              'name',
              'quantity',
              { key: 'stock.price_without_discount', label: 'price' },
              { key: 'stock.discount', label: 'discount' },
              'final_price',
            ]"
          >
            <template #cell(name)="data">
              <b-card-text class="font-weight-bold mb-25">
                {{ data.item.stock.product }}
              </b-card-text>
            </template>

            <template #cell(stock.discount)="data">
              <b-card-text class="font-weight-bold mb-25">
                {{ data.item.stock.discount }}%
              </b-card-text>
            </template>

            <template #cell(final_price)="data">
              <b-card-text class="font-weight-bold mb-25">
                {{ data.item.stock.price }}
              </b-card-text>
            </template>

            <template #cell(quantity)="data">
              <b-card-text class="font-weight-bold mb-25">
                {{ data.item.count }}
              </b-card-text>
            </template>
            <!--             
            <template #cell(quantity)="data">
              <b-card-text class="font-weight-bold mb-25">
                {{ data.item.count }}
              </b-card-text>
            </template>
            <template #cell(quantity)="data">
              <b-card-text class="font-weight-bold mb-25">
                {{ data.item.count }}
              </b-card-text>
            </template>
            <template #cell(quantity)="data">
              <b-card-text class="font-weight-bold mb-25">
                {{ data.item.count }}
              </b-card-text>
            </template> -->
          </b-table-lite>

          <b-card-body class="invoice-padding pb-0">
            <b-row>
              <b-col
                cols="12"
                md="6"
                class="mt-md-0 mt-3"
                order="2"
                order-md="1"
              >
              </b-col>

              <b-col
                cols="12"
                md="6"
                class="mt-md-6 d-flex justify-content-end"
                order="1"
                order-md="2"
              >
                <div class="invoice-total-wrapper">
                  <div class="invoice-total-item">
                    <p class="invoice-total-title">Subtotal:</p>
                    <p class="invoice-total-amount">
                      ${{ verbal.totals.total_price.toFixed(2) }}
                    </p>
                  </div>
                  <div class="invoice-total-item">
                    <p class="invoice-total-title">Discount:</p>
                    <p class="invoice-total-amount">
                      ${{ verbal.totals.total_discount.toFixed(2) }}
                    </p>
                  </div>
                  <hr class="my-50" />
                  <div class="invoice-total-item">
                    <p class="invoice-total-title">Total:</p>
                    <p class="invoice-total-amount">
                      ${{ verbal.totals.final_price.toFixed(2) }}
                    </p>
                  </div>
                </div>
              </b-col>
            </b-row>
          </b-card-body>
          <hr class="invoice-spacing" />
        </b-card>
      </b-col>

      <b-col cols="12" md="4" xl="3" class="invoice-actions">
        <b-card>
          <b-button
            v-ripple.400="'rgba(186, 191, 199, 0.15)'"
            variant="outline-secondary"
            class="mb-75"
            block
            @click="printInvoice"
          >
            Print
          </b-button>

          <b-button
            v-ripple.400="'rgba(186, 191, 199, 0.15)'"
            variant="outline-secondary"
            class="mb-75 mt-20"
            block
            @click="submitOrder"
          >
            Submit Order
          </b-button>
        </b-card>
      </b-col>
    </b-row>
  </section>
</template>

<script>
import { ref, onUnmounted } from "@vue/composition-api";
import store from "@/store";
import router from "@/router";
import {
  BRow,
  BCol,
  BCard,
  BCardBody,
  BTableLite,
  BCardText,
  BButton,
  BAlert,
  BLink,
  VBToggle,
} from "bootstrap-vue";
import Logo from "@core/layouts/components/Logo.vue";
import Ripple from "vue-ripple-directive";
import verbalStoreModule from "../verbalStoreModule";

export default {
  directives: {
    Ripple,
    "b-toggle": VBToggle,
  },
  props: ["verbal"],
  components: {
    BRow,
    BCol,
    BCard,
    BCardBody,
    BTableLite,
    BCardText,
    BButton,
    BAlert,
    BLink,

    Logo,
  },
  setup(props) {
    const invoiceData = ref(null);
    const paymentDetails = ref({});

    const INVOICE_APP_STORE_MODULE_NAME = "app-verbal";

    // Register module
    if (!store.hasModule(INVOICE_APP_STORE_MODULE_NAME))
      store.registerModule(INVOICE_APP_STORE_MODULE_NAME, verbalStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(INVOICE_APP_STORE_MODULE_NAME))
        store.unregisterModule(INVOICE_APP_STORE_MODULE_NAME);
    });

    const submitOrder = () => {
      delete props.verbal.cart
      delete props.verbal.totals
      store
        .dispatch("app-verbal/addVerbal", props.verbal)
        .then((response) => {
          if (response.status == 201) {
            window.location.reload(true)
          }
        })
        .catch((error) => {});
    };

    // store.dispatch('app-verbal/fetchInvoice', { id: router.currentRoute.params.id })
    //   .then(response => {
    //     invoiceData.value = response.data.invoice
    //     paymentDetails.value = response.data.paymentDetails
    //   })
    //   .catch(error => {
    //     if (error.response.status === 404) {
    //       invoiceData.value = undefined
    //     }
    //   })

    const printInvoice = () => {
      var divToPrint = document.getElementById("verbal-card");
      var newWin = window.open("");
      newWin.document.write(divToPrint.outerHTML);
      newWin.print();
    };

    return {
      invoiceData,
      paymentDetails,
      printInvoice,
      submitOrder,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "~@core/scss/base/pages/app-invoice.scss";
</style>

<style lang="scss">
@media print {
  // Global Styles
  body {
    background-color: transparent !important;
  }
  nav.header-navbar {
    display: none;
  }
  .main-menu {
    display: none;
  }
  .header-navbar-shadow {
    display: none !important;
  }
  .content.app-content {
    margin-left: 0;
    padding-top: 2rem !important;
  }
  footer.footer {
    display: none;
  }
  .card {
    background-color: transparent;
    box-shadow: none;
  }
  .customizer-toggle {
    display: none !important;
  }

  // Invoice Specific Styles
  .invoice-preview-wrapper {
    .row.invoice-preview {
      .col-md-8 {
        max-width: 100%;
        flex-grow: 1;
      }

      .invoice-preview-card {
        .card-body:nth-of-type(2) {
          .row {
            > .col-12 {
              max-width: 50% !important;
            }

            .col-12:nth-child(2) {
              display: flex;
              align-items: flex-start;
              justify-content: flex-end;
              margin-top: 0 !important;
            }
          }
        }
      }
    }

    // Action Right Col
    .invoice-actions {
      display: none;
    }
  }
}
</style>
