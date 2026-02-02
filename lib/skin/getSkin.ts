import { defaultSkin } from '@/tenants/_default/skin';
import { merge } from 'lodash';

export function getSkin(tenant) {
  if (tenant && tenant.brand_json) {
    return merge({}, defaultSkin, tenant.brand_json);
  }
  return defaultSkin;
}
