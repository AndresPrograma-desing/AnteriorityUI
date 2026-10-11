// Registro central de todos los packs de react-icons empaquetados. Único lugar que importa
// los 31 packs de una — IconCatalog, las stories de Icons y el entry point `anteriority-ui/icons`
// (ver ../../../icons/index.js) reusan este archivo en vez de repetir la lista de imports.
import * as ai from './ai/index';
import * as bi from './bi/index';
import * as bs from './bs/index';
import * as cg from './cg/index';
import * as ci from './ci/index';
import * as di from './di/index';
import * as fa from './fa/index';
import * as fa6 from './fa6/index';
import * as fc from './fc/index';
import * as fi from './fi/index';
import * as gi from './gi/index';
import * as go from './go/index';
import * as gr from './gr/index';
import * as hi from './hi/index';
import * as hi2 from './hi2/index';
import * as im from './im/index';
import * as io from './io/index';
import * as io5 from './io5/index';
import * as lia from './lia/index';
import * as lu from './lu/index';
import * as md from './md/index';
import * as pi from './pi/index';
import * as ri from './ri/index';
import * as rx from './rx/index';
import * as si from './si/index';
import * as sl from './sl/index';
import * as tb from './tb/index';
import * as tfi from './tfi/index';
import * as ti from './ti/index';
import * as vsc from './vsc/index';
import * as wi from './wi/index';

export const ICON_PACKS = { ai, bi, bs, cg, ci, di, fa, fa6, fc, fi, gi, go, gr, hi, hi2, im, io, io5, lia, lu, md, pi, ri, rx, si, sl, tb, tfi, ti, vsc, wi };
export const ICON_PACK_NAMES = Object.keys(ICON_PACKS).sort();
