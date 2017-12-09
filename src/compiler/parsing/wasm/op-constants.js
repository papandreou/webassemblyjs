// @flow

const illegalop = 'illegal';

const magicModuleHeader = [0x00, 0x61, 0x73, 0x6d];
const moduleVersion = [0x01, 0x00, 0x00, 0x00];

type Symbol = {
  name: string;
  numberOfArgs: number;
};

function createSymbol(name: string, numberOfArgs: number = 0): Symbol {
  return {
    name,
    numberOfArgs,
  };
}

const types = {
  func: 0x60,
  result: 0x40,
};

const exportTypes = {
  func: 0x00,
  table: 0x01,
  mem: 0x02,
  global: 0x03,
};

const valtypes = {
  0x7f: 'i32',
  0x7e: 'i64',
  0x7d: 'f32',
  0x7c: 'f64',
};

const sections = {
  customSection: 0,
  typeSection: 1,
  importSection: 2,
  funcSection: 3,
  tableSection: 4,
  memorySection: 5,
  globalSection: 6,
  exportSection: 7,
  startSection: 8,
  elemSection: 9,
  codeSection: 10,
  dataSection: 11,
};

const symbols = {
  0x00: createSymbol('unreachable'),
  0x01: createSymbol('nop'),

  0x02: createSymbol('block', 1),
  0x03: createSymbol('loop'),
  0x04: createSymbol('if'),

  0x05: createSymbol('else'),
  0x06: illegalop,
  0x07: illegalop,
  0x08: illegalop,
  0x09: illegalop,
  0x0a: illegalop,
  0x0b: createSymbol('end'),

  0x0c: createSymbol('br'),
  0x0d: createSymbol('br_if'),
  0x0e: createSymbol('br_table'),
  0x0f: createSymbol('return'),

  0x10: createSymbol('call'),
  0x11: createSymbol('call_indirect'),

  0x12: illegalop,
  0x13: illegalop,
  0x14: illegalop,
  0x15: illegalop,
  0x16: illegalop,
  0x17: illegalop,
  0x18: illegalop,
  0x19: illegalop,

  0x1a: createSymbol('drop'),
  0x1b: createSymbol('select'),

  0x1c: illegalop,
  0x1d: illegalop,
  0x1e: illegalop,
  0x1f: illegalop,

  0x20: createSymbol('get_local', 1),
  0x21: createSymbol('set_local', 1),
  0x22: createSymbol('tee_local', 1),
  0x23: createSymbol('get_global', 1),
  0x24: createSymbol('set_global', 1),

  0x25: illegalop,
  0x26: illegalop,
  0x27: illegalop,

  0x28: createSymbol('i32_load', 1),
  0x29: createSymbol('i64_load', 1),
  0x2a: createSymbol('f32_load', 1),
  0x2b: createSymbol('f64_load', 1),
  0x2c: createSymbol('i32_load8_s', 1),
  0x2d: createSymbol('i32_load8_u', 1),
  0x2e: createSymbol('i32_load16_s', 1),
  0x2f: createSymbol('i32_load16_u', 1),
  0x30: createSymbol('i64_load8_s', 1),
  0x31: createSymbol('i64_load8_u', 1),
  0x32: createSymbol('i64_load16_s', 1),
  0x33: createSymbol('i64_load16_u', 1),
  0x34: createSymbol('i64_load32_s', 1),
  0x35: createSymbol('i64_load32_u', 1),

  0x36: createSymbol('i32_store', 1),
  0x37: createSymbol('i64_store', 1),
  0x38: createSymbol('f32_store', 1),
  0x39: createSymbol('f64_store', 1),
  0x3a: createSymbol('i32_store8', 1),
  0x3b: createSymbol('i32_store16', 1),
  0x3c: createSymbol('i64_store8', 1),
  0x3d: createSymbol('i64_store16', 1),
  0x3e: createSymbol('i64_store32', 1),

  0x3f: createSymbol('current_memory'),
  0x40: createSymbol('grow_memory'),

  0x41: createSymbol('i32_const', 1),
  0x42: createSymbol('i64_const', 1),
  0x43: createSymbol('f32_const', 1),
  0x44: createSymbol('f64_const', 1),

  0x45: createSymbol('i32_eqz'),
  0x46: createSymbol('i32_eq'),
  0x47: createSymbol('i32_ne'),
  0x48: createSymbol('i32_lt_s'),
  0x49: createSymbol('i32_lt_u'),
  0x4a: createSymbol('i32_gt_s'),
  0x4b: createSymbol('i32_gt_u'),
  0x4c: createSymbol('i32_le_s'),
  0x4d: createSymbol('i32_le_u'),
  0x4e: createSymbol('i32_ge_s'),
  0x4f: createSymbol('i32_ge_u'),

  0x50: createSymbol('i64_eqz'),
  0x51: createSymbol('i64_eq'),
  0x52: createSymbol('i64_ne'),
  0x53: createSymbol('i64_lt_s'),
  0x54: createSymbol('i64_lt_u'),
  0x55: createSymbol('i64_gt_s'),
  0x56: createSymbol('i64_gt_u'),
  0x57: createSymbol('i64_le_s'),
  0x58: createSymbol('i64_le_u'),
  0x59: createSymbol('i64_ge_s'),
  0x5a: createSymbol('i64_ge_u'),

  0x5b: createSymbol('f32_eq'),
  0x5c: createSymbol('f32_ne'),
  0x5d: createSymbol('f32_lt'),
  0x5e: createSymbol('f32_gt'),
  0x5f: createSymbol('f32_le'),
  0x60: createSymbol('f32_ge'),

  0x61: createSymbol('f64_eq'),
  0x62: createSymbol('f64_ne'),
  0x63: createSymbol('f64_lt'),
  0x64: createSymbol('f64_gt'),
  0x65: createSymbol('f64_le'),
  0x66: createSymbol('f64_ge'),

  0x67: createSymbol('i32_clz'),
  0x68: createSymbol('i32_ctz'),
  0x69: createSymbol('i32_popcnt'),
  0x6a: createSymbol('i32_add'),
  0x6b: createSymbol('i32_sub'),
  0x6c: createSymbol('i32_mul'),
  0x6d: createSymbol('i32_div_s'),
  0x6e: createSymbol('i32_div_u'),
  0x6f: createSymbol('i32_rem_s'),
  0x70: createSymbol('i32_rem_u'),
  0x71: createSymbol('i32_and'),
  0x72: createSymbol('i32_or'),
  0x73: createSymbol('i32_xor'),
  0x74: createSymbol('i32_shl'),
  0x75: createSymbol('i32_shr_s'),
  0x76: createSymbol('i32_shr_u'),
  0x77: createSymbol('i32_rotl'),
  0x78: createSymbol('i32_rotr'),

  0x79: createSymbol('i64_clz'),
  0x7a: createSymbol('i64_ctz'),
  0x7b: createSymbol('i64_popcnt'),
  0x7c: createSymbol('i64_add'),
  0x7d: createSymbol('i64_sub'),
  0x7e: createSymbol('i64_mul'),
  0x7f: createSymbol('i64_div_s'),
  0x80: createSymbol('i64_div_u'),
  0x81: createSymbol('i64_rem_s'),
  0x82: createSymbol('i64_rem_u'),
  0x83: createSymbol('i64_and'),
  0x84: createSymbol('i64_or'),
  0x85: createSymbol('i64_xor'),
  0x86: createSymbol('i64_shl'),
  0x87: createSymbol('i64_shr_s'),
  0x88: createSymbol('i64_shr_u'),
  0x89: createSymbol('i64_rotl'),
  0x8a: createSymbol('i64_rotr'),

  0x8b: createSymbol('f32_abs'),
  0x8c: createSymbol('f32_neg'),
  0x8d: createSymbol('f32_ceil'),
  0x8e: createSymbol('f32_floor'),
  0x8f: createSymbol('f32_trunc'),
  0x90: createSymbol('f32_nearest'),
  0x91: createSymbol('f32_sqrt'),
  0x92: createSymbol('f32_add'),
  0x93: createSymbol('f32_sub'),
  0x94: createSymbol('f32_mul'),
  0x95: createSymbol('f32_div'),
  0x96: createSymbol('f32_min'),
  0x97: createSymbol('f32_max'),
  0x98: createSymbol('f32_copysign'),

  0x99: createSymbol('f64_abs'),
  0x9a: createSymbol('f64_neg'),
  0x9b: createSymbol('f64_ceil'),
  0x9c: createSymbol('f64_floor'),
  0x9d: createSymbol('f64_trunc'),
  0x9e: createSymbol('f64_nearest'),
  0x9f: createSymbol('f64_sqrt'),
  0xa0: createSymbol('f64_add'),
  0xa1: createSymbol('f64_sub'),
  0xa2: createSymbol('f64_mul'),
  0xa3: createSymbol('f64_div'),
  0xa4: createSymbol('f64_min'),
  0xa5: createSymbol('f64_max'),
  0xa6: createSymbol('f64_copysign'),

  0xa7: createSymbol('i32_wrap_i64'),
  0xa8: createSymbol('i32_trunc_s_f32'),
  0xa9: createSymbol('i32_trunc_u_f32'),
  0xaa: createSymbol('i32_trunc_s_f64'),
  0xab: createSymbol('i32_trunc_u_f64'),
  0xac: createSymbol('i64_extend_s_i32'),
  0xad: createSymbol('i64_extend_u_i32'),
  0xae: createSymbol('i64_trunc_s_f32'),
  0xaf: createSymbol('i64_trunc_u_f32'),
  0xb0: createSymbol('i64_trunc_s_f64'),
  0xb1: createSymbol('i64_trunc_u_f64'),
  0xb2: createSymbol('f32_convert_s_i32'),
  0xb3: createSymbol('f32_convert_u_i32'),
  0xb4: createSymbol('f32_convert_s_i64'),
  0xb5: createSymbol('f32_convert_u_i64'),
  0xb6: createSymbol('f32_demote_f64'),
  0xb7: createSymbol('f64_convert_s_i32'),
  0xb8: createSymbol('f64_convert_u_i32'),
  0xb9: createSymbol('f64_convert_s_i64'),
  0xba: createSymbol('f64_convert_u_i64'),
  0xbb: createSymbol('f64_promote_f32'),

  0xbc: createSymbol('i32_reinterpret_f32'),
  0xbd: createSymbol('i64_reinterpret_f64'),
  0xbe: createSymbol('f32_reinterpret_i32'),
  0xbf: createSymbol('f64_reinterpret_i64'),
};

module.exports = {
  symbols,
  sections,
  magicModuleHeader,
  moduleVersion,
  types,
  valtypes,
  exportTypes,
};
