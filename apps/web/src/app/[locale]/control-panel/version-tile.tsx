import { Tile, TileDescription, TileTitle } from "@huddle/ui/tile";
import { DownloadIcon } from "lucide-react";
import { PageIcon } from "@/components/page-icons";
import { getTranslation } from "@/i18n/server";
import { appVersion } from "@/lib/constants";

const versionLabel = appVersion
  ? `v${appVersion.replace(/^v/, "")}`
  : "unknown";

// The upstream update check is disabled in this build, so the tile only
// shows the running version.
export async function VersionTile() {
  const { t } = await getTranslation();
  return (
    <Tile>
      <PageIcon>
        <DownloadIcon />
      </PageIcon>
      <TileTitle>{versionLabel}</TileTitle>
      <TileDescription>
        {t("versionTileInstalled", { defaultValue: "Installed version" })}
      </TileDescription>
    </Tile>
  );
}
