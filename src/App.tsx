import type { Component } from "solid-js";

import { For, Show, createEffect, createSignal } from "solid-js";

import uFuzzy from "@leeoniya/ufuzzy";
import styles from "./App.module.css";

type IconData = { url: string; description: string }[];

const metadatas = [
  "/icons/mage/metadata.txt",
  "/icons/feather/metadata.txt",
  "/icons/heroicons/metadata.txt",
  "/icons/line-awesome/metadata.txt",
  "/icons/solar/metadata.txt",
];

let opts = {
  interIns: 5,
  intraChars: "[w-]",
};
const MAX_RESULTS = 100;
let uf = new uFuzzy(opts);

function search(needle: string, iconData: IconData) {
  const haystack = iconData.map((icon) => icon.description);
  let idxs = uf.filter(haystack, needle);
  if (idxs != null && idxs.length > 0) {
    let infoThresh = 1e3;
    if (idxs.length <= infoThresh) {
      let info = uf.info(idxs, haystack, needle);
      let order = uf.sort(info, haystack, needle);
      return order.map((i) => iconData[info.idx[i]]);
    } else {
      return idxs.map((i) => iconData[i]);
    }
  }
  return [];
}

function copyIconToClipboard(iconUrl: string) {
  // fetch icon svg data, then copy to clipboard
  fetch(iconUrl)
    .then((response) => response.text())
    .then((svg) => {
      navigator.clipboard.writeText(svg);
    });
}

const App: Component = () => {
  const [searchValue, setSearchValue] = createSignal("bookmark");
  const [metadata, setMetadata] = createSignal<IconData>();

  createEffect(() => {
    metadatas.forEach((metaurl) => {
      fetchMetadata(metaurl).then((metadata) => {
        setMetadata((m) => {
          if (!m) return metadata;
          return [...m, ...metadata];
        });
      });
    });
  });

  const results = () => {
    if (!metadata()) return [];
    return search(searchValue(), metadata()!);
  };

  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <input
          tabIndex={0}
          type="text"
          value={searchValue()}
          placeholder="Search icons..."
          onInput={(e) => setSearchValue(e.currentTarget.value)}
        />
        <div class="flex flex-wrap gap-2 pt-5 justify-center">
          <For each={results().slice(0, MAX_RESULTS)}>
            {(icon) => <IconView icon={icon} />}
          </For>
        </div>
        <Show when={results().length === 0 && searchValue()}>
          <div class="text-center text-2xl p-5 text-white">No results</div>
        </Show>
        <Show when={results().length > MAX_RESULTS}>
          <div class="text-center text-2xl p-5 text-white">
            Results truncated, please refine search
          </div>
        </Show>
      </header>
    </div>
  );
};

const IconView: Component<{ icon: { url: string; description: string } }> = (
  props
) => {
  const iconName = props.icon.url.split("/").slice(-1)[0];
  // Shows icon with a overlay that says "copy" on hover
  return (
    <div class="relative">
      <img
        class="rounded p-2 bg-white w-24 h-24"
        src={"/icons/" + props.icon.url}
        alt={props.icon.description}
      />
      <div
        onClick={() => copyIconToClipboard("/icons/" + props.icon.url)}
        class="absolute text-sm rounded transition-all hover:opacity-100 bg-opacity-80 opacity-0 bg-black top-0 left-0 text-white cursor-pointer w-full h-full"
      >
        Copy
        <br />
        {iconName}
      </div>
    </div>
  );
};

async function fetchMetadata(metaurl: string) {
  const resp = await fetch(metaurl);
  const text = await resp.text();
  const metadata = text.split("\n").map((line) => {
    const [url, description] = line.split(":");
    return { url, description: description || "" };
  });
  return metadata;
}

export default App;
