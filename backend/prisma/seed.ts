/// <reference types="node" />
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting QASA extended seed (categories + element types)...");

  // --- Categorías ampliadas ---
  const categories = [
    {
      code: "ESTRUCTURA",
      name: "Estructura",
      description:
        "Elementos fijos o de construcción (paredes, techos, puertas, suelos)",
    },
    {
      code: "ILUMINACION_ELECTRICIDAD",
      name: "Iluminación y electricidad",
      description: "Fuentes de luz y dispositivos eléctricos",
    },
    {
      code: "MOBILIARIO",
      name: "Mobiliario",
      description: "Muebles, mesas, sillas, armarios, camas y complementos",
    },
    {
      code: "TEXTIL_DECORACION",
      name: "Textil y decoración",
      description:
        "Ropa blanca, cortinas, cojines, alfombras y elementos decorativos",
    },
    {
      code: "VAJILLA_UTENSILIOS",
      name: "Vajilla y utensilios",
      description: "Utensilios y menaje de cocina y comedor",
    },
    {
      code: "ELECTRODOMESTICOS",
      name: "Electrodomésticos",
      description: "Aparatos eléctricos de cocina o limpieza",
    },
    {
      code: "BANO",
      name: "Baño",
      description: "Equipamiento y accesorios sanitarios",
    },
    {
      code: "COCINA_FIJA",
      name: "Cocina fija",
      description: "Estructura y mobiliario empotrado de cocina",
    },
    {
      code: "LIMPIEZA",
      name: "Limpieza",
      description: "Herramientas y productos de limpieza",
    },
    {
      code: "SEGURIDAD_MANTENIMIENTO",
      name: "Seguridad y mantenimiento",
      description: "Detectores, cerraduras, botiquines, extintores",
    },
    {
      code: "CLIMATIZACION",
      name: "Climatización",
      description: "Equipos de calefacción, aire acondicionado y ventilación",
    },
    {
      code: "TECNOLOGIA_ENTRETENIMIENTO",
      name: "Tecnología y entretenimiento",
      description: "Dispositivos multimedia, conectividad e Internet",
    },
    {
      code: "EXTERIOR_TERRAZA",
      name: "Exterior y terraza",
      description: "Mobiliario exterior, barbacoa, luces y plantas de exterior",
    },
    {
      code: "ALMACENAMIENTO",
      name: "Almacenamiento",
      description: "Cajas, percheros, zapateros y estanterías",
    },
    {
      code: "JARDINERIA",
      name: "Jardinería",
      description: "Macetas, regaderas, herramientas de jardín",
    },
    {
      code: "MENAJE_TEXTIL",
      name: "Menaje textil",
      description: "Manteles, servilletas, trapos de cocina, paños",
    },
    {
      code: "ACCESORIOS_BIENVENIDA",
      name: "Accesorios de bienvenida",
      description: "Amenities, carteles, llaves, guías y manuales de uso",
    },
    {
      code: "OFICINA_ESCRITORIO",
      name: "Oficina y escritorio",
      description: "Muebles y accesorios de trabajo o estudio",
    },
    {
      code: "NINOS_BEBES",
      name: "Niños y bebés",
      description: "Equipamiento y seguridad infantil",
    },
    {
      code: "MASCOTAS",
      name: "Mascotas",
      description: "Artículos y mobiliario para mascotas",
    },
  ];

  // Use transaction and upsert to make it idempotent
  await prisma.$transaction(
    categories.map((cat) =>
      prisma.elementCategory.upsert({
        where: { code: cat.code },
        update: {
          name: cat.name,
          description: cat.description,
        },
        create: cat,
      })
    )
  );
  console.log(`✅ Upserted ${categories.length} categories`);

  const allCategories = await prisma.elementCategory.findMany();
  const cat = Object.fromEntries(allCategories.map((c) => [c.name, c.id]));

  // --- Tipos de elementos ampliados ---
  const elementTypes = [
    // 🏠 ESTRUCTURA
    { code: "PARED", name: "Pared", category_id: cat["Estructura"] },
    { code: "TECHO", name: "Techo", category_id: cat["Estructura"] },
    { code: "SUELO", name: "Suelo", category_id: cat["Estructura"] },
    { code: "PUERTA", name: "Puerta", category_id: cat["Estructura"] },
    { code: "VENTANA", name: "Ventana", category_id: cat["Estructura"] },
    { code: "ZOCALO", name: "Zócalo", category_id: cat["Estructura"] },
    { code: "MARCO", name: "Marco", category_id: cat["Estructura"] },
    { code: "PERSIANA", name: "Persiana", category_id: cat["Estructura"] },
    {
      code: "MOLDURA_DECORATIVA",
      name: "Moldura decorativa",
      category_id: cat["Estructura"],
    },
    { code: "BARANDA", name: "Baranda", category_id: cat["Estructura"] },

    // 💡 ILUMINACIÓN Y ELECTRICIDAD
    {
      code: "LAMPARA_TECHO",
      name: "Lámpara techo",
      category_id: cat["Iluminación y electricidad"],
    },
    {
      code: "APLIQUE_PARED",
      name: "Aplique pared",
      category_id: cat["Iluminación y electricidad"],
    },
    {
      code: "LAMPARA_PIE",
      name: "Lámpara de pie",
      category_id: cat["Iluminación y electricidad"],
    },
    {
      code: "LAMPARA_MESA",
      name: "Lámpara de mesa",
      category_id: cat["Iluminación y electricidad"],
    },
    {
      code: "BOMBILLA_LED",
      name: "Bombilla LED",
      category_id: cat["Iluminación y electricidad"],
    },
    {
      code: "ENCHUFE",
      name: "Enchufe",
      category_id: cat["Iluminación y electricidad"],
    },
    {
      code: "INTERRUPTOR",
      name: "Interruptor",
      category_id: cat["Iluminación y electricidad"],
    },
    {
      code: "TOMA_USB",
      name: "Toma USB",
      category_id: cat["Iluminación y electricidad"],
    },
    {
      code: "REGULADOR_LUZ",
      name: "Regulador de luz",
      category_id: cat["Iluminación y electricidad"],
    },

    // 🪑 MOBILIARIO
    {
      code: "SOFA_3_PLAZAS",
      name: "Sofá 3 plazas",
      category_id: cat["Mobiliario"],
    },
    { code: "SOFA_CAMA", name: "Sofá cama", category_id: cat["Mobiliario"] },
    {
      code: "MESA_COMEDOR",
      name: "Mesa comedor",
      category_id: cat["Mobiliario"],
    },
    {
      code: "MESA_AUXILIAR",
      name: "Mesa auxiliar",
      category_id: cat["Mobiliario"],
    },
    { code: "SILLA", name: "Silla", category_id: cat["Mobiliario"] },
    { code: "TABURETE", name: "Taburete", category_id: cat["Mobiliario"] },
    { code: "CAMA_DOBLE", name: "Cama doble", category_id: cat["Mobiliario"] },
    {
      code: "CAMA_INDIVIDUAL",
      name: "Cama individual",
      category_id: cat["Mobiliario"],
    },
    { code: "CABECERO", name: "Cabecero", category_id: cat["Mobiliario"] },
    { code: "ARMARIO", name: "Armario", category_id: cat["Mobiliario"] },
    { code: "COMODA", name: "Cómoda", category_id: cat["Mobiliario"] },
    {
      code: "MESITA_NOCHE",
      name: "Mesita de noche",
      category_id: cat["Mobiliario"],
    },
    {
      code: "REPISA_FLOTANTE",
      name: "Repisa flotante",
      category_id: cat["Mobiliario"],
    },
    { code: "MUEBLE_TV", name: "Mueble TV", category_id: cat["Mobiliario"] },

    // 🧺 TEXTIL Y DECORACIÓN
    {
      code: "CORTINA_AMERICANA",
      name: "Cortina americana",
      category_id: cat["Textil y decoración"],
    },
    {
      code: "CORTINA_BLACKOUT",
      name: "Cortina blackout",
      category_id: cat["Textil y decoración"],
    },
    {
      code: "ALFOMBRA",
      name: "Alfombra",
      category_id: cat["Textil y decoración"],
    },
    {
      code: "SABANAS",
      name: "Sábanas",
      category_id: cat["Textil y decoración"],
    },
    {
      code: "ACOLCHADO",
      name: "Acolchado",
      category_id: cat["Textil y decoración"],
    },
    {
      code: "COJINES",
      name: "Cojines",
      category_id: cat["Textil y decoración"],
    },
    {
      code: "CUADRO_DECORATIVO",
      name: "Cuadro decorativo",
      category_id: cat["Textil y decoración"],
    },
    {
      code: "PLANTA_ARTIFICIAL",
      name: "Planta artificial",
      category_id: cat["Textil y decoración"],
    },
    {
      code: "TAPIZ_MURAL",
      name: "Tapiz mural",
      category_id: cat["Textil y decoración"],
    },
    {
      code: "TOALLAS",
      name: "Toallas",
      category_id: cat["Textil y decoración"],
    },

    // 🍽️ VAJILLA Y UTENSILIOS
    {
      code: "PLATO_LLANO",
      name: "Plato llano",
      category_id: cat["Vajilla y utensilios"],
    },
    {
      code: "PLATO_HONDO",
      name: "Plato hondo",
      category_id: cat["Vajilla y utensilios"],
    },
    { code: "TAZA", name: "Taza", category_id: cat["Vajilla y utensilios"] },
    {
      code: "CUCHILLO",
      name: "Cuchillo",
      category_id: cat["Vajilla y utensilios"],
    },
    {
      code: "TENEDOR",
      name: "Tenedor",
      category_id: cat["Vajilla y utensilios"],
    },
    {
      code: "CUCHARA",
      name: "Cuchara",
      category_id: cat["Vajilla y utensilios"],
    },
    {
      code: "SARTEN",
      name: "Sartén",
      category_id: cat["Vajilla y utensilios"],
    },
    { code: "OLLA", name: "Olla", category_id: cat["Vajilla y utensilios"] },
    {
      code: "TABLA_CORTAR",
      name: "Tabla de cortar",
      category_id: cat["Vajilla y utensilios"],
    },
    {
      code: "COPA_VINO",
      name: "Copa vino",
      category_id: cat["Vajilla y utensilios"],
    },
    {
      code: "VASO_AGUA",
      name: "Vaso agua",
      category_id: cat["Vajilla y utensilios"],
    },
    {
      code: "BANDEJA",
      name: "Bandeja",
      category_id: cat["Vajilla y utensilios"],
    },

    // 🔌 ELECTRODOMÉSTICOS
    {
      code: "CAFETERA_NESPRESSO",
      name: "Cafetera Nespresso",
      category_id: cat["Electrodomésticos"],
    },
    {
      code: "MICROONDAS",
      name: "Microondas",
      category_id: cat["Electrodomésticos"],
    },
    {
      code: "LAVADORA",
      name: "Lavadora",
      category_id: cat["Electrodomésticos"],
    },
    {
      code: "FRIGORIFICO",
      name: "Frigorífico",
      category_id: cat["Electrodomésticos"],
    },
    {
      code: "AIRFRYER",
      name: "Airfryer",
      category_id: cat["Electrodomésticos"],
    },
    {
      code: "HORNO_ELECTRICO",
      name: "Horno eléctrico",
      category_id: cat["Electrodomésticos"],
    },
    {
      code: "TOSTADORA",
      name: "Tostadora",
      category_id: cat["Electrodomésticos"],
    },
    {
      code: "LAVAVAJILLAS",
      name: "Lavavajillas",
      category_id: cat["Electrodomésticos"],
    },
    {
      code: "HERVIDOR_AGUA",
      name: "Hervidor agua",
      category_id: cat["Electrodomésticos"],
    },

    // 🚿 BAÑO
    { code: "LAVABO", name: "Lavabo", category_id: cat["Baño"] },
    { code: "INODORO", name: "Inodoro", category_id: cat["Baño"] },
    { code: "BIDET", name: "Bidet", category_id: cat["Baño"] },
    { code: "DUCHA", name: "Ducha", category_id: cat["Baño"] },
    { code: "ESPEJO", name: "Espejo", category_id: cat["Baño"] },
    {
      code: "PORTA_PAPEL_HIGIENICO",
      name: "Porta papel higiénico",
      category_id: cat["Baño"],
    },
    { code: "TOALLERO", name: "Toallero", category_id: cat["Baño"] },
    { code: "CESTO_ROPA", name: "Cesto ropa", category_id: cat["Baño"] },

    // 🍳 COCINA FIJA
    { code: "FREGADERO", name: "Fregadero", category_id: cat["Cocina fija"] },
    { code: "ENCIMERA", name: "Encimera", category_id: cat["Cocina fija"] },
    {
      code: "CAMPANA_EXTRACTORA",
      name: "Campana extractora",
      category_id: cat["Cocina fija"],
    },
    {
      code: "ARMARIO_ALTO",
      name: "Armario alto",
      category_id: cat["Cocina fija"],
    },
    {
      code: "ARMARIO_BAJO",
      name: "Armario bajo",
      category_id: cat["Cocina fija"],
    },
    { code: "DESPENSA", name: "Despensa", category_id: cat["Cocina fija"] },

    // 🧹 LIMPIEZA
    { code: "ESCOBA", name: "Escoba", category_id: cat["Limpieza"] },
    { code: "MOPA", name: "Mopa", category_id: cat["Limpieza"] },
    { code: "CUBO", name: "Cubo", category_id: cat["Limpieza"] },
    { code: "ASPIRADORA", name: "Aspiradora", category_id: cat["Limpieza"] },
    { code: "GUANTES", name: "Guantes", category_id: cat["Limpieza"] },
    {
      code: "PANOS_MICROFIBRA",
      name: "Paños microfibra",
      category_id: cat["Limpieza"],
    },

    // 🔐 SEGURIDAD Y MANTENIMIENTO
    {
      code: "DETECTOR_HUMO",
      name: "Detector de humo",
      category_id: cat["Seguridad y mantenimiento"],
    },
    {
      code: "DETECTOR_MONOXIDO",
      name: "Detector monóxido",
      category_id: cat["Seguridad y mantenimiento"],
    },
    {
      code: "EXTINTOR",
      name: "Extintor",
      category_id: cat["Seguridad y mantenimiento"],
    },
    {
      code: "CAJA_FUERTE",
      name: "Caja fuerte",
      category_id: cat["Seguridad y mantenimiento"],
    },
    {
      code: "BOTIQUIN",
      name: "Botiquín",
      category_id: cat["Seguridad y mantenimiento"],
    },
    {
      code: "MANUAL_SEGURIDAD",
      name: "Manual seguridad",
      category_id: cat["Seguridad y mantenimiento"],
    },

    // 🌡️ CLIMATIZACIÓN
    {
      code: "AIRE_ACONDICIONADO",
      name: "Aire acondicionado",
      category_id: cat["Climatización"],
    },
    { code: "RADIADOR", name: "Radiador", category_id: cat["Climatización"] },
    {
      code: "VENTILADOR",
      name: "Ventilador",
      category_id: cat["Climatización"],
    },
    {
      code: "TERMOSTATO",
      name: "Termostato",
      category_id: cat["Climatización"],
    },

    // 📺 TECNOLOGÍA
    {
      code: "TV",
      name: "TV",
      category_id: cat["Tecnología y entretenimiento"],
    },
    {
      code: "ROUTER_WIFI",
      name: "Router WiFi",
      category_id: cat["Tecnología y entretenimiento"],
    },
    {
      code: "CHROMECAST",
      name: "Chromecast",
      category_id: cat["Tecnología y entretenimiento"],
    },
    {
      code: "ALTAVOZ_BLUETOOTH",
      name: "Altavoz Bluetooth",
      category_id: cat["Tecnología y entretenimiento"],
    },
    {
      code: "CABLE_HDMI",
      name: "Cable HDMI",
      category_id: cat["Tecnología y entretenimiento"],
    },

    // 🌿 EXTERIOR
    {
      code: "MESA_EXTERIOR",
      name: "Mesa exterior",
      category_id: cat["Exterior y terraza"],
    },
    {
      code: "SILLA_EXTERIOR",
      name: "Silla exterior",
      category_id: cat["Exterior y terraza"],
    },
    {
      code: "SOMBRILLA",
      name: "Sombrilla",
      category_id: cat["Exterior y terraza"],
    },
    {
      code: "TUMBONA",
      name: "Tumbona",
      category_id: cat["Exterior y terraza"],
    },
    {
      code: "BARBACOA",
      name: "Barbacoa",
      category_id: cat["Exterior y terraza"],
    },

    // 📦 ALMACENAMIENTO
    {
      code: "CAJA_ORGANIZADORA",
      name: "Caja organizadora",
      category_id: cat["Almacenamiento"],
    },
    { code: "ZAPATERO", name: "Zapatero", category_id: cat["Almacenamiento"] },
    { code: "PERCHERO", name: "Perchero", category_id: cat["Almacenamiento"] },
    {
      code: "CESTA_DECORATIVA",
      name: "Cesta decorativa",
      category_id: cat["Almacenamiento"],
    },

    // 🌱 JARDINERÍA
    {
      code: "MACETA_INTERIOR",
      name: "Maceta interior",
      category_id: cat["Jardinería"],
    },
    { code: "REGADERA", name: "Regadera", category_id: cat["Jardinería"] },
    { code: "MANGUERA", name: "Manguera", category_id: cat["Jardinería"] },

    // 🧻 MENAJE TEXTIL
    { code: "MANTEL", name: "Mantel", category_id: cat["Menaje textil"] },
    {
      code: "SERVILLETA_TELA",
      name: "Servilleta tela",
      category_id: cat["Menaje textil"],
    },
    {
      code: "TRAPO_COCINA",
      name: "Trapo cocina",
      category_id: cat["Menaje textil"],
    },
    {
      code: "PANO_MANO",
      name: "Paño de mano",
      category_id: cat["Menaje textil"],
    },

    // 🎁 ACCESORIOS DE BIENVENIDA
    {
      code: "GUIA_TURISTICA",
      name: "Guía turística",
      category_id: cat["Accesorios de bienvenida"],
    },
    {
      code: "MAPA_CIUDAD",
      name: "Mapa ciudad",
      category_id: cat["Accesorios de bienvenida"],
    },
    {
      code: "PACK_AMENITIES",
      name: "Pack amenities",
      category_id: cat["Accesorios de bienvenida"],
    },
    {
      code: "CARTEL_WIFI",
      name: "Cartel WiFi",
      category_id: cat["Accesorios de bienvenida"],
    },

    // 💼 OFICINA
    {
      code: "ESCRITORIO",
      name: "Escritorio",
      category_id: cat["Oficina y escritorio"],
    },
    {
      code: "SILLA_OFICINA",
      name: "Silla oficina",
      category_id: cat["Oficina y escritorio"],
    },
    {
      code: "LAMPARA_ESCRITORIO",
      name: "Lámpara escritorio",
      category_id: cat["Oficina y escritorio"],
    },

    // 👶 NIÑOS Y BEBÉS
    { code: "CUNA", name: "Cuna", category_id: cat["Niños y bebés"] },
    { code: "TRONA", name: "Trona", category_id: cat["Niños y bebés"] },
    {
      code: "PROTECTOR_ENCHUFES",
      name: "Protector enchufes",
      category_id: cat["Niños y bebés"],
    },
    { code: "JUGUETES", name: "Juguetes", category_id: cat["Niños y bebés"] },

    // 🐾 MASCOTAS
    {
      code: "CAMA_MASCOTA",
      name: "Cama mascota",
      category_id: cat["Mascotas"],
    },
    { code: "COMEDERO", name: "Comedero", category_id: cat["Mascotas"] },
    { code: "BEBEDERO", name: "Bebedero", category_id: cat["Mascotas"] },
    { code: "RASCADOR", name: "Rascador", category_id: cat["Mascotas"] },
  ];

  // Use transaction and upsert to make it idempotent
  await prisma.$transaction(
    elementTypes.map((type) =>
      prisma.elementType.upsert({
        where: { code: type.code },
        update: {
          name: type.name,
          category_id: type.category_id,
        },
        create: type,
      })
    )
  );
  console.log(`✅ Upserted ${elementTypes.length} element types`);
}

main()
  .catch((e) => {
    console.error(e);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
