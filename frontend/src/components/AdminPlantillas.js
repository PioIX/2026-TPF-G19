"use client";
import { useEffect, useState } from "react";
import Button from "./Button";
import { api } from "@/lib/api";
import styles from "./TablaCrud.module.css";
const POSICIONES = ["POR", "DEF", "MED", "DEL"];
const FORM_VACIO = { jugador_id: "", posicion: "DEL", valoracion: 80 };

export default function AdminPlantillas() {
  const [plantillas, setPlantillas] = useState([]);
  const [selecciones, setSelecciones] = useState([]);
  const [mundiales, setMundiales] = useState([]);
  const [jugadores, setJugadores] = useState([]);
  const [nuevaPlantilla, setNuevaPlantilla] = useState({ seleccion_id: "", mundial_id: "" });
  const [plantillaAbierta, setPlantillaAbierta] = useState(null); // plantilla cuyos jugadores se están viendo
  const [integrantes, setIntegrantes] = useState([]);
  const [form, setForm] = useState(FORM_VACIO);
  const [editandoId, setEditandoId] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [error, setError] = useState("");
  const [version, setVersion] = useState(0); // al cambiar, se vuelven a pedir las listas


