import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting QASA extended seed (categories + element types)...");

  // --- Categorías ampliadas ---
  const categories = [
    {
      name: "Estructura",
      description:
        "Elementos fijos o de construcción (paredes, techos, puertas, suelos)",
    },
    {
      name: "Iluminación y electricidad",
      description: "Fuentes de luz y dispositivos eléctricos",
    },
    {
      name: "Mobiliario",
      description: "Muebles, mesas, sillas, armarios, camas y complementos",
    },
    {
      name: "Textil y decoración",
      description:
        "Ropa blanca, cortinas, cojines, alfombras y elementos decorativos",
    },
    {
      name: "Vajilla y utensilios",
      description: "Utensilios y menaje de cocina y comedor",
    },
    {
      name: "Electrodomésticos",
      description: "Aparatos eléctricos de cocina o limpieza",
    },
    { name: "Baño", description: "Equipamiento y accesorios sanitarios" },
    {
      name: "Cocina fija",
      description: "Estructura y mobiliario empotrado de cocina",
    },
    { name: "Limpieza", description: "Herramientas y productos de limpieza" },
    {
      name: "Seguridad y mantenimiento",
      description: "Detectores, cerraduras, botiquines, extintores",
    },
    {
      name: "Climatización",
      description: "Equipos de calefacción, aire acondicionado y ventilación",
    },
    {
      name: "Tecnología y entretenimiento",
      description: "Dispositivos multimedia, conectividad e Internet",
    },
    {
      name: "Exterior y terraza",
      description: "Mobiliario exterior, barbacoa, luces y plantas de exterior",
    },
    {
      name: "Almacenamiento",
      description: "Cajas, percheros, zapateros y estanterías",
    },
    {
      name: "Jardinería",
      description: "Macetas, regaderas, herramientas de jardín",
    },
    {
      name: "Menaje textil",
      description: "Manteles, servilletas, trapos de cocina, paños",
    },
    {
      name: "Accesorios de bienvenida",
      description: "Amenities, carteles, llaves, guías y manuales de uso",
    },
    {
      name: "Oficina y escritorio",
      description: "Muebles y accesorios de trabajo o estudio",
    },
    { name: "Niños y bebés", description: "Equipamiento y seguridad infantil" },
    { name: "Mascotas", description: "Artículos y mobiliario para mascotas" },
  ];

  await prisma.elementCategory.createMany({ data: categories });
  console.log(`✅ Inserted ${categories.length} categories`);

  const allCategories = await prisma.elementCategory.findMany();
  const cat = Object.fromEntries(allCategories.map((c) => [c.name, c.id]));

  // --- Tipos de elementos ampliados ---
  const elementTypes = [
    // 🏠 ESTRUCTURA
    { name: "Pared", category_id: cat["Estructura"] },
    { name: "Techo", category_id: cat["Estructura"] },
    { name: "Suelo", category_id: cat["Estructura"] },
    { name: "Puerta", category_id: cat["Estructura"] },
    { name: "Ventana", category_id: cat["Estructura"] },
    { name: "Zócalo", category_id: cat["Estructura"] },
    { name: "Marco", category_id: cat["Estructura"] },
    { name: "Persiana", category_id: cat["Estructura"] },
    { name: "Moldura decorativa", category_id: cat["Estructura"] },
    { name: "Baranda", category_id: cat["Estructura"] },

    // 💡 ILUMINACIÓN Y ELECTRICIDAD
    { name: "Lámpara techo", category_id: cat["Iluminación y electricidad"] },
    { name: "Aplique pared", category_id: cat["Iluminación y electricidad"] },
    { name: "Lámpara de pie", category_id: cat["Iluminación y electricidad"] },
    { name: "Lámpara de mesa", category_id: cat["Iluminación y electricidad"] },
    { name: "Bombilla LED", category_id: cat["Iluminación y electricidad"] },
    { name: "Enchufe", category_id: cat["Iluminación y electricidad"] },
    { name: "Interruptor", category_id: cat["Iluminación y electricidad"] },
    { name: "Toma USB", category_id: cat["Iluminación y electricidad"] },
    {
      name: "Regulador de luz",
      category_id: cat["Iluminación y electricidad"],
    },

    // 🪑 MOBILIARIO
    { name: "Sofá 3 plazas", category_id: cat["Mobiliario"] },
    { name: "Sofá cama", category_id: cat["Mobiliario"] },
    { name: "Mesa comedor", category_id: cat["Mobiliario"] },
    { name: "Mesa auxiliar", category_id: cat["Mobiliario"] },
    { name: "Silla", category_id: cat["Mobiliario"] },
    { name: "Taburete", category_id: cat["Mobiliario"] },
    { name: "Cama doble", category_id: cat["Mobiliario"] },
    { name: "Cama individual", category_id: cat["Mobiliario"] },
    { name: "Cabecero", category_id: cat["Mobiliario"] },
    { name: "Armario", category_id: cat["Mobiliario"] },
    { name: "Cómoda", category_id: cat["Mobiliario"] },
    { name: "Mesita de noche", category_id: cat["Mobiliario"] },
    { name: "Repisa flotante", category_id: cat["Mobiliario"] },
    { name: "Mueble TV", category_id: cat["Mobiliario"] },

    // 🧺 TEXTIL Y DECORACIÓN
    { name: "Cortina americana", category_id: cat["Textil y decoración"] },
    { name: "Cortina blackout", category_id: cat["Textil y decoración"] },
    { name: "Alfombra", category_id: cat["Textil y decoración"] },
    { name: "Sábanas", category_id: cat["Textil y decoración"] },
    { name: "Acolchado", category_id: cat["Textil y decoración"] },
    { name: "Cojines", category_id: cat["Textil y decoración"] },
    { name: "Cuadro decorativo", category_id: cat["Textil y decoración"] },
    { name: "Planta artificial", category_id: cat["Textil y decoración"] },
    { name: "Tapiz mural", category_id: cat["Textil y decoración"] },
    { name: "Toallas", category_id: cat["Textil y decoración"] },

    // 🍽️ VAJILLA Y UTENSILIOS
    { name: "Plato llano", category_id: cat["Vajilla y utensilios"] },
    { name: "Plato hondo", category_id: cat["Vajilla y utensilios"] },
    { name: "Taza", category_id: cat["Vajilla y utensilios"] },
    { name: "Cuchillo", category_id: cat["Vajilla y utensilios"] },
    { name: "Tenedor", category_id: cat["Vajilla y utensilios"] },
    { name: "Cuchara", category_id: cat["Vajilla y utensilios"] },
    { name: "Sartén", category_id: cat["Vajilla y utensilios"] },
    { name: "Olla", category_id: cat["Vajilla y utensilios"] },
    { name: "Tabla de cortar", category_id: cat["Vajilla y utensilios"] },
    { name: "Copa vino", category_id: cat["Vajilla y utensilios"] },
    { name: "Vaso agua", category_id: cat["Vajilla y utensilios"] },
    { name: "Bandeja", category_id: cat["Vajilla y utensilios"] },

    // 🔌 ELECTRODOMÉSTICOS
    { name: "Cafetera Nespresso", category_id: cat["Electrodomésticos"] },
    { name: "Microondas", category_id: cat["Electrodomésticos"] },
    { name: "Lavadora", category_id: cat["Electrodomésticos"] },
    { name: "Frigorífico", category_id: cat["Electrodomésticos"] },
    { name: "Airfryer", category_id: cat["Electrodomésticos"] },
    { name: "Horno eléctrico", category_id: cat["Electrodomésticos"] },
    { name: "Tostadora", category_id: cat["Electrodomésticos"] },
    { name: "Lavavajillas", category_id: cat["Electrodomésticos"] },
    { name: "Hervidor agua", category_id: cat["Electrodomésticos"] },

    // 🚿 BAÑO
    { name: "Lavabo", category_id: cat["Baño"] },
    { name: "Inodoro", category_id: cat["Baño"] },
    { name: "Bidet", category_id: cat["Baño"] },
    { name: "Ducha", category_id: cat["Baño"] },
    { name: "Espejo", category_id: cat["Baño"] },
    { name: "Porta papel higiénico", category_id: cat["Baño"] },
    { name: "Toallero", category_id: cat["Baño"] },
    { name: "Cesto ropa", category_id: cat["Baño"] },

    // 🍳 COCINA FIJA
    { name: "Fregadero", category_id: cat["Cocina fija"] },
    { name: "Encimera", category_id: cat["Cocina fija"] },
    { name: "Campana extractora", category_id: cat["Cocina fija"] },
    { name: "Armario alto", category_id: cat["Cocina fija"] },
    { name: "Armario bajo", category_id: cat["Cocina fija"] },
    { name: "Despensa", category_id: cat["Cocina fija"] },

    // 🧹 LIMPIEZA
    { name: "Escoba", category_id: cat["Limpieza"] },
    { name: "Mopa", category_id: cat["Limpieza"] },
    { name: "Cubo", category_id: cat["Limpieza"] },
    { name: "Aspiradora", category_id: cat["Limpieza"] },
    { name: "Guantes", category_id: cat["Limpieza"] },
    { name: "Paños microfibra", category_id: cat["Limpieza"] },

    // 🔐 SEGURIDAD Y MANTENIMIENTO
    { name: "Detector de humo", category_id: cat["Seguridad y mantenimiento"] },
    {
      name: "Detector monóxido",
      category_id: cat["Seguridad y mantenimiento"],
    },
    { name: "Extintor", category_id: cat["Seguridad y mantenimiento"] },
    { name: "Caja fuerte", category_id: cat["Seguridad y mantenimiento"] },
    { name: "Botiquín", category_id: cat["Seguridad y mantenimiento"] },
    { name: "Manual seguridad", category_id: cat["Seguridad y mantenimiento"] },

    // 🌡️ CLIMATIZACIÓN
    { name: "Aire acondicionado", category_id: cat["Climatización"] },
    { name: "Radiador", category_id: cat["Climatización"] },
    { name: "Ventilador", category_id: cat["Climatización"] },
    { name: "Termostato", category_id: cat["Climatización"] },

    // 📺 TECNOLOGÍA
    { name: "TV", category_id: cat["Tecnología y entretenimiento"] },
    { name: "Router WiFi", category_id: cat["Tecnología y entretenimiento"] },
    { name: "Chromecast", category_id: cat["Tecnología y entretenimiento"] },
    {
      name: "Altavoz Bluetooth",
      category_id: cat["Tecnología y entretenimiento"],
    },
    { name: "Cable HDMI", category_id: cat["Tecnología y entretenimiento"] },

    // 🌿 EXTERIOR
    { name: "Mesa exterior", category_id: cat["Exterior y terraza"] },
    { name: "Silla exterior", category_id: cat["Exterior y terraza"] },
    { name: "Sombrilla", category_id: cat["Exterior y terraza"] },
    { name: "Tumbona", category_id: cat["Exterior y terraza"] },
    { name: "Barbacoa", category_id: cat["Exterior y terraza"] },

    // 📦 ALMACENAMIENTO
    { name: "Caja organizadora", category_id: cat["Almacenamiento"] },
    { name: "Zapatero", category_id: cat["Almacenamiento"] },
    { name: "Perchero", category_id: cat["Almacenamiento"] },
    { name: "Cesta decorativa", category_id: cat["Almacenamiento"] },

    // 🌱 JARDINERÍA
    { name: "Maceta interior", category_id: cat["Jardinería"] },
    { name: "Regadera", category_id: cat["Jardinería"] },
    { name: "Manguera", category_id: cat["Jardinería"] },

    // 🧻 MENAJE TEXTIL
    { name: "Mantel", category_id: cat["Menaje textil"] },
    { name: "Servilleta tela", category_id: cat["Menaje textil"] },
    { name: "Trapo cocina", category_id: cat["Menaje textil"] },
    { name: "Paño de mano", category_id: cat["Menaje textil"] },

    // 🎁 ACCESORIOS DE BIENVENIDA
    { name: "Guía turística", category_id: cat["Accesorios de bienvenida"] },
    { name: "Mapa ciudad", category_id: cat["Accesorios de bienvenida"] },
    { name: "Pack amenities", category_id: cat["Accesorios de bienvenida"] },
    { name: "Cartel WiFi", category_id: cat["Accesorios de bienvenida"] },

    // 💼 OFICINA
    { name: "Escritorio", category_id: cat["Oficina y escritorio"] },
    { name: "Silla oficina", category_id: cat["Oficina y escritorio"] },
    { name: "Lámpara escritorio", category_id: cat["Oficina y escritorio"] },

    // 👶 NIÑOS Y BEBÉS
    { name: "Cuna", category_id: cat["Niños y bebés"] },
    { name: "Trona", category_id: cat["Niños y bebés"] },
    { name: "Protector enchufes", category_id: cat["Niños y bebés"] },
    { name: "Juguetes", category_id: cat["Niños y bebés"] },

    // 🐾 MASCOTAS
    { name: "Cama mascota", category_id: cat["Mascotas"] },
    { name: "Comedero", category_id: cat["Mascotas"] },
    { name: "Bebedero", category_id: cat["Mascotas"] },
    { name: "Rascador", category_id: cat["Mascotas"] },
  ];

  await prisma.elementType.createMany({ data: elementTypes });
  console.log(`✅ Inserted ${elementTypes.length} element types`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
