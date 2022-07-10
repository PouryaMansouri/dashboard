<template>
  <div class="navbar-container d-flex content align-items-center">
    <!-- Nav Menu Toggler -->
    <ul class="nav navbar-nav d-xl-none">
      <li class="nav-item">
        <b-link class="nav-link" @click="toggleVerticalMenuActive">
          <feather-icon icon="MenuIcon" size="21" />
        </b-link>
      </li>
    </ul>
    <!-- Right Col -->
    <b-navbar-nav class="nav align-items-center ml-auto">
      <info
        :typeName="typeName"
        :parentName="parentName"
        :parentType="parentType"
      />
    </b-navbar-nav>
    <!-- Left Col -->
    <div
      class="bookmark-wrapper align-items-center flex-grow-1 d-none d-lg-flex"
    >
      <!-- Bookmarks Container -->
      <!-- <bookmarks /> -->
    </div>

    <b-navbar-nav class="nav align-items-center ml-auto">
      <!-- <locale /> -->
      <!-- <dark-Toggler class="d-none d-lg-block" />
      <search-bar /> -->
      <!-- <cart-dropdown /> -->
      <info-dropdown
        :notifCount="notifications.length"
        :notifications="notifications"
      />
      <notification-dropdown
        :notifCount="notifications.length"
        :notifications="notifications"
      />
      <user-dropdown />
    </b-navbar-nav>
  </div>
</template>

<script>
import { BLink, BNavbarNav } from "bootstrap-vue";
import Bookmarks from "./components/Bookmarks.vue";
import Info from "./components/Info.vue";
import SearchBar from "./components/SearchBar.vue";
import DarkToggler from "./components/DarkToggler.vue";
import CartDropdown from "./components/CartDropdown.vue";
import NotificationDropdown from "./components/NotificationDropdown.vue";
import UserDropdown from "./components/UserDropdown.vue";

export default {
  components: {
    BLink,

    // Navbar Components
    BNavbarNav,
    Bookmarks,
    Info,
    SearchBar,
    DarkToggler,
    CartDropdown,
    NotificationDropdown,
    UserDropdown,
  },
  methods: {
    fetchSelf() {
      this.$http.get("users/self/data").then((res) => {
        console.log("info", res.data);
        if (res.data.userType == "Coach") {
          this.typeName = "مربی";
          if (res.data.coach.club != null)
            this.parentName = res.data.coach.club.name;
          this.parentType = "باشگاه";
        } else if (res.data.userType == "Player") {
          this.typeName = "بازیکن";
          if (res.data.player.coach != null)
            this.parentName = res.data.player.coach.name;
          this.parentType = "مربی";
        } else {
          this.typeName = "باشگاه";
          this.parentName = "";
          this.parentType = "";
        }
      });
    },
  },
  data() {
    return {
      typeName: "",
      parentName: "",
      parentType: "",
      notifications: [
        // {
        //   title: "هم تیمی برای شما پیدا شد",
        //   avatar: require("@/assets/images/avatars/6-small.png"),
        //   subtitle: "عماد میرزایی در تاریخ 0.0.0 پیدا شد",
        //   type: "light-success",
        // },
        // {
        //   title: "این هفته تمامی سانس ها تعطیل میباشد",
        //   avatar: "ب پ",
        //   subtitle: "باشگاه پیام",
        //   type: "light-info",
        // },
      ],
    };
  },
  created() {
    this.fetchSelf();
  },
  props: {
    toggleVerticalMenuActive: {
      type: Function,
      default: () => {},
    },
  },
};
</script>
