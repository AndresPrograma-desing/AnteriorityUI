// Registro central de todos los packs de react-icons empaquetados. Único lugar que importa
// los 31 packs de una — IconCatalog, las stories de Icons y el entry point `anteriority-ui/icons`
// (ver ../../../icons/index.js) reusan este archivo en vez de repetir la lista de imports.
import * as ai from './ai/index.js';
import * as bi from './bi/index.js';
import * as bs from './bs/index.js';
import * as cg from './cg/index.js';
import * as ci from './ci/index.js';
import * as di from './di/index.js';
import * as fa from './fa/index.js';
import * as fa6 from './fa6/index.js';
import * as fc from './fc/index.js';
import * as fi from './fi/index.js';
import * as gi from './gi/index.js';
import * as go from './go/index.js';
import * as gr from './gr/index.js';
import * as hi from './hi/index.js';
import * as hi2 from './hi2/index.js';
import * as im from './im/index.js';
import * as io from './io/index.js';
import * as io5 from './io5/index.js';
import * as lia from './lia/index.js';
import * as lu from './lu/index.js';
import * as md from './md/index.js';
import * as pi from './pi/index.js';
import * as ri from './ri/index.js';
import * as rx from './rx/index.js';
import * as si from './si/index.js';
import * as sl from './sl/index.js';
import * as tb from './tb/index.js';
import * as tfi from './tfi/index.js';
import * as ti from './ti/index.js';
import * as vsc from './vsc/index.js';
import * as wi from './wi/index.js';

export const ICON_PACKS = { ai, bi, bs, cg, ci, di, fa, fa6, fc, fi, gi, go, gr, hi, hi2, im, io, io5, lia, lu, md, pi, ri, rx, si, sl, tb, tfi, ti, vsc, wi };
export const ICON_PACK_NAMES = Object.keys(ICON_PACKS).sort();
