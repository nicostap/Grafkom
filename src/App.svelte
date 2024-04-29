<script lang="ts">
  import { onMount } from "svelte";
  import { renderMain } from "./lib/main";
  import { fpsStore, tickStore } from "./lib/utils/StatCounter";
  import {
    modeStationary,
    modeFPS,
    modeFollowShaun,
    modeFollowFarmer,
    modeFollowBitzer,
  } from "./lib/utils/CameraController";

  onMount(() => {
    const renderTerminate = renderMain();

    // if keypress h, then hide the settings button
    window.addEventListener("keypress", (e) => {
      if (e.key === "h") {
        showToggleButton = !showToggleButton;
        showStuff = showToggleButton;
      }
    });

    return () => {
      if (renderTerminate) {
        renderTerminate();
      }
    };
  });

  let showToggleButton = true;
  let showStuff = false;
</script>

<div>
  <div class="buttonNavbar">
    {#if showToggleButton}
      <button
        class="buttonUI"
        on:click={() => {
          showStuff = !showStuff;
          console.log(showStuff);
        }}
      >
        ⚙
      </button>
    {/if}
    {#if showStuff}
      <button class="buttonUI" on:click={modeStationary}> Stationary </button>
      <button class="buttonUI" on:click={modeFPS}> FPS </button>
      <button class="buttonUI" on:click={modeFollowShaun}>
        Follow Shaun
      </button>
      <button class="buttonUI" on:click={modeFollowFarmer}>
        Follow Farmer
      </button>
      <button class="buttonUI" on:click={modeFollowBitzer}>
        Follow Bitzer
      </button>
    {/if}
  </div>
  {#if showStuff}
    <div class="info">
      <span style="width: 5em;">
        FPS: <span>{$fpsStore.toFixed(1)}</span>
      </span>
      <span style="width: 9em;">
        CPU Tick: <span>{$tickStore.toFixed(2)}ms</span>
      </span>
    </div>
  {/if}
  <canvas
    id="your_canvas"
    style="position: relative;background-color: rgb(174, 185, 255);"
  >
  </canvas>
</div>

<style>
  .buttonNavbar {
    display: flex;
    flex-wrap: nowrap;
    position: absolute;
    bottom: 0%;
    z-index: 1;
  }

  .buttonUI {
    margin: 6px;
    display: inline-block;
    padding: 10px 20px;
    font-size: 1vw;
    font-weight: bold;
    text-align: center;
    text-decoration: none;
    color: #fff;
    background-color: #007bff;
    border: 2px solid #007bff;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .buttonUI:hover {
    background-color: #0056b3;
    border-color: #0056b3;
  }

  .info {
    position: absolute;
    z-index: 1;
    bottom: 0;
    right: 0;
    color: white;
    padding: 1em;
    display: flex;
    gap: 1em;
  }

  .info > span {
    display: flex;
    justify-content: space-between;
  }
</style>
