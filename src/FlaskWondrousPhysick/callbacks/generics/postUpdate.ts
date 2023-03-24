import { Combinator } from "@fowp/combinator";
import { WispEffects } from "@fowp/items/wisp.effects";
import { FOWPState } from "@fowp/states/fowpState";
import { Color2ID } from "@shared/helpers/Color";
import { ModCallback } from "isaac-typescript-definitions";
import { ColorDefault, getPlayerFromIndex } from "isaacscript-common";

export function postUpdate(mod: Mod): void {
  mod.AddCallback(ModCallback.POST_UPDATE, () => {
    const { wisps, color, usedTears, statsPlayer } = FOWPState.persistent;

    Object.keys(wisps).forEach((pID) => {
      const player = getPlayerFromIndex(pID);

      if (usedTears !== undefined) {
        const cTears = usedTears[pID];
        if (cTears !== undefined && cTears.length > 0) {
          const wispsWithoutFilter = wisps
            .get(pID)
            ?.map((entity, index) => ({ entity, index }));
          const ws = wispsWithoutFilter?.filter(({ entity }) =>
            entity.IsDead(),
          );

          const trinketIDs = ws?.map(({ entity }) =>
            Color2ID(color.get(entity.InitSeed) ?? ColorDefault),
          );

          if (
            trinketIDs !== undefined &&
            player !== undefined &&
            ws !== undefined &&
            ws.length > 0
          ) {
            const combinator = new Combinator(player);
            combinator.combine(WispEffects, trinketIDs);

            ws.forEach(({ index }) => {
              wisps.get(pID)?.splice(index, 1);
            });

            const stats = statsPlayer[pID];
            if (stats !== undefined) {
              trinketIDs.forEach((tear) => {
                const index = cTears.indexOf(tear);
                cTears.splice(index, 1);
              });

              stats.tearIndex -= trinketIDs.length;
            }
          }
        }
      }
    });
  });
}
