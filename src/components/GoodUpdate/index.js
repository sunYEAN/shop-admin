import GoodsAlbum from './GoodsAlbum';
import GoodsAttribute from './GoodsAttribute';
import {WithBaseCard} from '../../utils/hoc';

const GoodAlbum = WithBaseCard(GoodsAlbum);
const GoodAttr = WithBaseCard(GoodsAttribute);


export {
  GoodAlbum,
  GoodAttr
};
