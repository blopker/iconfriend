import type { Component } from "solid-js";

import { For, createEffect, createSignal } from "solid-js";

import uFuzzy from "@leeoniya/ufuzzy";
import styles from "./App.module.css";

type IconData = { url: string; description: string }[];

const metadatas = [
  "/icons/mage/metadata.txt",
  "/icons/feather/metadata.txt",
  "/icons/heroicons/metadata.txt",
  "/icons/line-awesome/metadata.txt",
];

let opts = {};

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
        <div class="flex flex-wrap gap-2 pt-5 justify-between">
          <For each={results().slice(0, 1000)}>
            {(icon) => <IconView icon={icon} />}
          </For>
        </div>
      </header>
    </div>
  );
};
<svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  stroke-width="1.5"
  stroke="currentColor"
  aria-hidden="true"
  data-slot="icon"
>
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    d="m3 3 1.664 1.664M21 21l-1.5-1.5m-5.485-1.242L12 17.25 4.5 21V8.742m.164-4.078a2.15 2.15 0 0 1 1.743-1.342 48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185V19.5M4.664 4.664 19.5 19.5"
  />
</svg>;

const IconView: Component<{ icon: { url: string; description: string } }> = (
  props
) => {
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
        class="absolute hover:opacity-80 opacity-0 bg-black top-0 left-0 text-white cursor-pointer w-full h-full"
      >
        Copy
      </div>
    </div>
  );
};

const metaurl = new URL("/icons/mage/metadata.txt", import.meta.url).href;
console.log("metaurl", metaurl);
async function fetchMetadata(metaurl: string) {
  const resp = await fetch(metaurl);
  const text = await resp.text();
  const metadata = text.split("\n").map((line) => {
    const [url, description] = line.split(":");
    return { url, description };
  });
  console.log("metadata", metadata);
  return metadata;
}
// fetchMetadata(metaurl);

export default App;
