import type { Component } from "solid-js";

import { For, Show, createEffect, createSignal } from "solid-js";

import uFuzzy from "@leeoniya/ufuzzy";

type IconData = { url: string; description: string }[];

// Icon metadata sources from multiple icon packs
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

/**
 * Performs fuzzy search on icon metadata
 * Uses uFuzzy library for fast, typo-tolerant search
 */
function search(needle: string, iconData: IconData) {
  const haystack = iconData.map((icon) => icon.description);
  let idxs = uf.filter(haystack, needle);
  
  if (idxs != null && idxs.length > 0) {
    let infoThresh = 1e3;
    
    // For manageable result sets, rank by relevance
    if (idxs.length <= infoThresh) {
      let info = uf.info(idxs, haystack, needle);
      let order = uf.sort(info, haystack, needle);
      return order.map((i) => iconData[info.idx[i]]);
    } else {
      // For large result sets, skip ranking for performance
      return idxs.map((i) => iconData[i]);
    }
  }
  
  return [];
}

/**
 * Fetches icon SVG and copies to clipboard
 * Provides instant access to icon source code
 */
function copyIconToClipboard(iconUrl: string) {
  fetch(iconUrl)
    .then((response) => response.text())
    .then((svg) => {
      navigator.clipboard.writeText(svg);
    });
}

const App: Component = () => {
  // Track search value - start empty for initial centered state
  const [searchValue, setSearchValue] = createSignal("");
  const [metadata, setMetadata] = createSignal<IconData>();
  
  // Track whether user has started searching (for layout transition)
  const [isSearching, setIsSearching] = createSignal(false);

  // Fetch icon metadata from all sources on mount
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

  // Perform fuzzy search on icon metadata
  const results = () => {
    if (!metadata() || !searchValue()) return [];
    return search(searchValue(), metadata()!);
  };

  // Handle search input changes and trigger layout transition
  const handleSearchInput = (e: InputEvent & { currentTarget: HTMLInputElement }) => {
    const value = e.currentTarget.value;
    setSearchValue(value);
    
    // Trigger layout transition when user starts typing
    if (value && !isSearching()) {
      setIsSearching(true);
    } else if (!value && isSearching()) {
      setIsSearching(false);
    }
  };

  return (
    <div class="min-h-screen bg-app-gradient font-sans antialiased">
      {/* 
        Main container with smooth transition between centered and top-aligned states
        Follows design system's page layout pattern with max-width and responsive padding
      */}
      <div 
        class="min-h-screen flex flex-col items-center px-8 transition-all duration-slow ease-standard"
        classList={{ 
          "justify-center pt-0": !isSearching(), 
          "justify-start pt-10 sm:pt-16": isSearching() 
        }}
      >
        {/* Hero section - visible only in initial centered state */}
        <Show when={!isSearching()}>
          <div class="text-center mb-12 animate-fade-in-up">
            {/* Main title with solid text color */}
            <h1 class="text-display text-text-primary mb-4">
              IconFriend
            </h1>
            
            {/* Subtitle with confident, direct messaging */}
            <p class="text-subtitle text-text-secondary">
              Find the perfect icon. Fast.
            </p>
          </div>
        </Show>

        {/* 
          Search bar with design system card pattern
          Uses content-surface with shadow-md and subtle border
        */}
        <div 
          class="w-full mb-8 transition-all duration-slow ease-standard animate-fade-in-up"
          style={{ "max-width": "680px", "animation-delay": "50ms" }}
        >
          {/* Search input container with clear button */}
          <div class="relative">
            <input
              class="w-full px-6 py-5 text-body text-text-primary placeholder:text-text-tertiary 
                     bg-content-surface rounded-2xl border border-border-subtle shadow-md
                     outline-none focus-visible:outline-none transition-all duration-normal ease-standard
                     hover:shadow-lg hover:-translate-y-0.5
                     focus:shadow-lg focus:-translate-y-1 focus:border-border-muted"
              style={{ "padding-right": searchValue() ? "3.5rem" : "1.5rem" }}
              tabIndex={0}
              type="text"
              value={searchValue()}
              placeholder="Search thousands of icons..."
              onInput={handleSearchInput}
              autofocus
            />
            
            {/* Clear button - only visible when there's text */}
            <Show when={searchValue()}>
              <button
                class="absolute right-4 top-1/2 -translate-y-1/2
                       w-8 h-8 rounded-full
                       bg-content-subtle hover:bg-action-secondary-bg-hover
                       text-text-secondary hover:text-text-primary
                       flex items-center justify-center
                       transition-all duration-fast ease-standard
                       hover:scale-110 active:scale-95"
                onClick={() => {
                  setSearchValue("");
                  setIsSearching(false);
                }}
                aria-label="Clear search"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  stroke-width="2.5" 
                  stroke-linecap="round" 
                  stroke-linejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </Show>
          </div>
          
          {/* Search suggestions - pill-style chips following design system */}
          <Show when={!isSearching()}>
            <div 
              class="flex flex-wrap gap-2 mt-4 justify-center animate-fade-in"
              style={{ "animation-delay": "100ms" }}
            >
              <For each={["arrow", "star", "user", "heart", "check", "settings", "home", "search", "menu", "close"]}>
                {(suggestion) => (
                  <button
                    class="px-4 py-2 rounded-full text-body-strong
                           bg-content-surface hover:bg-content-subtle
                           text-text-secondary hover:text-text-primary
                           border border-border-subtle shadow-sm
                           transition-all duration-fast ease-standard
                           hover:shadow-md hover:-translate-y-0.5 hover:scale-105
                           active:translate-y-0 active:scale-100
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo/20"
                    onClick={() => {
                      setSearchValue(suggestion);
                      setIsSearching(true);
                    }}
                  >
                    {suggestion}
                  </button>
                )}
              </For>
            </div>
          </Show>
        </div>

        {/* Results section - only visible when searching with spring animation */}
        <Show when={isSearching()}>
          <div class="w-full max-w-7xl animate-fade-in">
            {/* Icon grid using responsive grid pattern from design system */}
            <Show when={results().length > 0}>
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 pb-10">
                <For each={results().slice(0, MAX_RESULTS)}>
                  {(icon) => <IconView icon={icon} />}
                </For>
              </div>
            </Show>

            {/* Empty state with gentle messaging */}
            <Show when={results().length === 0 && searchValue()}>
              <div class="text-center py-20 px-5 animate-fade-in-up">
                {/* Large emoji icon following design system icon patterns */}
                <div class="text-6xl mb-6 opacity-40">🔍</div>
                
                <p class="text-h3 text-text-primary mb-3">
                  No matches found
                </p>
                
                <p class="text-body text-text-secondary">
                  Try a different search term
                </p>
              </div>
            </Show>

            {/* Truncation notice using info state styling */}
            <Show when={results().length > MAX_RESULTS}>
              <div class="text-center py-5 px-6 mx-auto max-w-2xl
                         bg-info-bg rounded-xl text-info-text text-body
                         animate-fade-in border border-border-subtle">
                Showing {MAX_RESULTS} of {results().length} results. Narrow your search for better results.
              </div>
            </Show>
          </div>
        </Show>
      </div>
    </div>
  );
};

/**
 * IconView component - displays individual icon with copy functionality
 * Follows design system's card pattern with hover effects and spring animations
 */
const IconView: Component<{ icon: { url: string; description: string } }> = (
  props
) => {
  const [copied, setCopied] = createSignal(false);

  // Handle icon copy with visual feedback
  const handleCopy = () => {
    copyIconToClipboard("/icons/" + props.icon.url);
    setCopied(true);
    
    // Reset copied state after feedback animation completes
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div 
      class="relative bg-content-surface rounded-2xl p-5 cursor-pointer
             border border-border-subtle shadow-md
             transition-all duration-normal ease-standard
             hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02]
             active:scale-[0.98] active:translate-y-0
             animate-spring-enter"
      onClick={handleCopy}
    >
      {/* Icon image container with proper aspect ratio */}
      <div class="w-full aspect-square flex items-center justify-center mb-2">
        <img
          class="w-full h-full object-contain"
          style={{ "filter": "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.05))" }}
          src={"/icons/" + props.icon.url}
          alt={props.icon.description}
        />
      </div>
      
      {/* 
        Hover overlay with glassmorphism effect
        Uses backdrop blur for modern MacOS-style transparency
      */}
      <div 
        class="absolute inset-0 bg-content-surface/90 backdrop-blur-soft rounded-2xl
               flex items-center justify-center
               opacity-0 transition-opacity duration-fast ease-standard
               hover:opacity-100"
      >
        <Show when={!copied()} fallback={
          // Success feedback state with spring animation
          <div class="flex flex-col items-center gap-2 text-success-text animate-bounce-in">
            <span class="text-4xl font-bold">✓</span>
            <span class="text-body-strong">Copied!</span>
          </div>
        }>
          {/* Copy prompt with subtle animation */}
          <div class="flex flex-col items-center gap-2 text-text-primary animate-bounce-in">
            <span class="text-2xl">📋</span>
            <span class="text-body-strong">Copy</span>
          </div>
        </Show>
      </div>
    </div>
  );
};

/**
 * Fetches and parses icon metadata from text files
 * Each line format: "path/to/icon.svg:description"
 * Returns array of icon data with URL and description
 */
async function fetchMetadata(metaurl: string) {
  const resp = await fetch(metaurl);
  const text = await resp.text();
  
  // Parse metadata file - each line contains path:description
  const metadata = text.split("\n").map((line) => {
    const [url, description] = line.split(":");
    return { url, description: description || "" };
  });
  return metadata;
}

export default App;
