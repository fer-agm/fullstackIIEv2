// Regiones y comunas para el checkout.
// La Región Metropolitana está completa; en las demás regiones es una lista abreviada (ampliar si se necesita).
export const REGIONS = {
  'Región de Arica y Parinacota': ['Arica', 'Camarones', 'Putre', 'General Lagos'],
  'Región de Tarapacá': ['Iquique', 'Alto Hospicio', 'Pozo Almonte', 'Pica'],
  'Región de Antofagasta': ['Antofagasta', 'Calama', 'Mejillones', 'Tocopilla', 'San Pedro de Atacama'],
  'Región de Atacama': ['Copiapó', 'Caldera', 'Vallenar', 'Chañaral'],
  'Región de Coquimbo': ['La Serena', 'Coquimbo', 'Ovalle', 'Illapel', 'Vicuña'],
  'Región de Valparaíso': ['Valparaíso', 'Viña del Mar', 'Quilpué', 'Villa Alemana', 'Concón', 'San Antonio', 'Quillota', 'Los Andes'],
  'Región Metropolitana de Santiago': [
    'Alhué', 'Buin', 'Calera de Tango', 'Cerrillos', 'Cerro Navia', 'Colina', 'Conchalí', 'Curacaví',
    'El Bosque', 'El Monte', 'Estación Central', 'Huechuraba', 'Independencia', 'Isla de Maipo',
    'La Cisterna', 'La Florida', 'La Granja', 'La Pintana', 'La Reina', 'Lampa', 'Las Condes',
    'Lo Barnechea', 'Lo Espejo', 'Lo Prado', 'Macul', 'Maipú', 'María Pinto', 'Melipilla', 'Ñuñoa',
    'Padre Hurtado', 'Paine', 'Pedro Aguirre Cerda', 'Peñaflor', 'Peñalolén', 'Pirque', 'Providencia',
    'Pudahuel', 'Puente Alto', 'Quilicura', 'Quinta Normal', 'Recoleta', 'Renca', 'San Bernardo',
    'San Joaquín', 'San José de Maipo', 'San Miguel', 'San Pedro', 'San Ramón', 'Santiago',
    'Talagante', 'Tiltil', 'Vitacura',
  ],
  "Región del Libertador General Bernardo O'Higgins": ['Rancagua', 'Machalí', 'San Fernando', 'Rengo', 'Santa Cruz'],
  'Región del Maule': ['Talca', 'Curicó', 'Linares', 'Constitución', 'Cauquenes'],
  'Región de Ñuble': ['Chillán', 'Chillán Viejo', 'San Carlos', 'Bulnes'],
  'Región del Biobío': ['Concepción', 'Talcahuano', 'San Pedro de la Paz', 'Chiguayante', 'Los Ángeles', 'Coronel'],
  'Región de La Araucanía': ['Temuco', 'Padre Las Casas', 'Villarrica', 'Pucón', 'Angol'],
  'Región de Los Ríos': ['Valdivia', 'La Unión', 'Río Bueno', 'Panguipulli'],
  'Región de Los Lagos': ['Puerto Montt', 'Osorno', 'Castro', 'Puerto Varas', 'Ancud'],
  'Región de Aysén del General Carlos Ibáñez del Campo': ['Coyhaique', 'Puerto Aysén', 'Chile Chico'],
  'Región de Magallanes y de la Antártica Chilena': ['Punta Arenas', 'Puerto Natales', 'Porvenir'],
};

export const DEFAULT_REGION = 'Región Metropolitana de Santiago';
export const getRegions = () => Object.keys(REGIONS);
export const getCommunes = (region) => REGIONS[region] || [];
