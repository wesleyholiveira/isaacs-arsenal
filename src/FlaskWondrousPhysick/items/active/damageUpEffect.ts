import { FOWPState } from "@fowp/states/fowpState";
import { EffectResult } from "@shared/types";

export function damageUpEffect(player: EntityPlayer): EffectResult {
  player.Damage += 1.5;

  if (!player.IsSubPlayer()) {
    FOWPState.persistent.dmgUp += 1.5;
  }
  return {
    charge: 2,
  };
}
