const wikiBase = 'https://upload.wikimedia.org/wikipedia/commons'

export const pageMedia = {
  compactCoastal:
    `${wikiBase}/thumb/6/66/Cesme%27ye_d%C3%B6nerken_izmir_sahil_yolu_-_panoramio.jpg/1920px-Cesme%27ye_d%C3%B6nerken_izmir_sahil_yolu_-_panoramio.jpg`,
  coastalHighway:
    `${wikiBase}/thumb/1/13/00_1833_North_West_Coastal_Highway_-_Western_Australia.jpg/1920px-00_1833_North_West_Coastal_Highway_-_Western_Australia.jpg`,
  sunsetArrival:
    `${wikiBase}/thumb/f/f3/2017-08-20_Outside_the_Arrivals_hall_at_the_terminal%2C_Faro_airport_%282%29.JPG/1920px-2017-08-20_Outside_the_Arrivals_hall_at_the_terminal%2C_Faro_airport_%282%29.JPG`,
  mercedesInterior:
    `${wikiBase}/thumb/f/f2/2023_Mercedes-Benz_E-Class_interior.jpg/1920px-2023_Mercedes-Benz_E-Class_interior.jpg`,
  sunsetCoast:
    `${wikiBase}/thumb/1/1e/Sunset_at_Pickering_Point_Lookout%2C_Great_Ocean_Road_%2853402059667%29.jpg/1920px-Sunset_at_Pickering_Point_Lookout%2C_Great_Ocean_Road_%2853402059667%29.jpg`,
}

const carMediaRegistry = {
  'BMW|X5': {
    translationKey: 'bmwX5',
    primaryImage:
      `${wikiBase}/thumb/e/e9/BMW_G05_LCI_X5_xDrive50e_M_Sport_Dravit_Grey_Metallic_%281%29.jpg/1920px-BMW_G05_LCI_X5_xDrive50e_M_Sport_Dravit_Grey_Metallic_%281%29.jpg`,
    gallery: [
      `${wikiBase}/thumb/2/20/BMW_G05_LCI_X5_xDrive50e_M_Sport_Dravit_Grey_Metallic_%2811%29.jpg/1920px-BMW_G05_LCI_X5_xDrive50e_M_Sport_Dravit_Grey_Metallic_%2811%29.jpg`,
      `${wikiBase}/thumb/1/17/BMW_G05_LCI_X5_xDrive50e_M_Sport_Dravit_Grey_Metallic_%282%29.jpg/1920px-BMW_G05_LCI_X5_xDrive50e_M_Sport_Dravit_Grey_Metallic_%282%29.jpg`,
      `${wikiBase}/thumb/5/58/BMW_G05_X5_xDrive40i_M_Sport_Merino_Leather_Coffee_%2812%29.jpg/1920px-BMW_G05_X5_xDrive40i_M_Sport_Merino_Leather_Coffee_%2812%29.jpg`,
    ],
  },
  'Mercedes-Benz|E-Class': {
    translationKey: 'mercedesEClass',
    primaryImage:
      `${wikiBase}/thumb/0/06/MERCEDES-BENZ_E-CLASS_%28W213%29_China.jpg/1920px-MERCEDES-BENZ_E-CLASS_%28W213%29_China.jpg`,
    gallery: [
      `${wikiBase}/thumb/3/3a/MERCEDES-BENZ_E-CLASS_%28W213%29_China_%282%29.jpg/1920px-MERCEDES-BENZ_E-CLASS_%28W213%29_China_%282%29.jpg`,
      `${wikiBase}/thumb/4/47/Mercedes-Benz_W213.jpg/1920px-Mercedes-Benz_W213.jpg`,
      `${wikiBase}/thumb/3/33/Mercedes-Benz_W213_%28E-class%29_interior.jpg/1920px-Mercedes-Benz_W213_%28E-class%29_interior.jpg`,
    ],
  },
  'Porsche|Cayenne': {
    translationKey: 'porscheCayenne',
    primaryImage:
      `${wikiBase}/thumb/8/87/2023_Porsche_Cayenne_S_IMG_0521.jpg/1920px-2023_Porsche_Cayenne_S_IMG_0521.jpg`,
    gallery: [
      `${wikiBase}/thumb/1/15/Porsche_Cayenne%2C_Auto_2024%2C_Zurich_%28PANA0862%29.jpg/1920px-Porsche_Cayenne%2C_Auto_2024%2C_Zurich_%28PANA0862%29.jpg`,
      `${wikiBase}/thumb/8/8d/2024_Porsche_Cayenne_Coup%C3%A9_GTS_DSC_7904.jpg/1920px-2024_Porsche_Cayenne_Coup%C3%A9_GTS_DSC_7904.jpg`,
      `${wikiBase}/thumb/f/f5/2018_Porsche_Cayenne_S_Interior.jpg/1920px-2018_Porsche_Cayenne_S_Interior.jpg`,
    ],
  },
}

function getCarRegistryKey(car) {
  return `${car.brand}|${car.model}`
}

export function getCarMedia(car) {
  return (
    carMediaRegistry[getCarRegistryKey(car)] || {
      translationKey: null,
      primaryImage: car.image,
      gallery: car.image ? [car.image] : [],
    }
  )
}

export function enrichCarMedia(car) {
  const media = getCarMedia(car)

  return {
    ...car,
    translationKey: media.translationKey,
    image: media.primaryImage || car.image,
    primaryImage: media.primaryImage || car.image,
    gallery: media.gallery.length ? media.gallery : [media.primaryImage || car.image].filter(Boolean),
  }
}
