import Vue = require("vue");
import { ComponentOptions } from "vue";

export default function <V extends Vue>(options: ComponentOptions<V>): ClassDecorator;
