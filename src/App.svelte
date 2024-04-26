<script lang="ts">
  import { onMount } from "svelte";
  import {
    renderMain,
    modeStationary,
    modeFPS,
    modeFollowShaun,
    fpsStore,
    tickStore,
  } from "./lib/main";

  onMount(() => {
    renderMain();
  });
</script>

<div>
  <div class="buttonNavbar">
    <button class="buttonUI" on:click={modeStationary}> Stationary </button>
    <button class="buttonUI" on:click={modeFPS}> FPS </button>
    <button class="buttonUI" on:click={modeFollowShaun}> Follow Shaun </button>
  </div>
  <div class="info">
    <span style="width: 5em;">
      FPS: <span>{$fpsStore.toFixed(1)}</span>
    </span>
    <span style="width: 8em;">
      CPU Tick: <span>{$tickStore.toFixed(2)}ms</span>
    </span>
  </div>
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
    z-index: 1;
  }

  .buttonUI {
    margin: 10px;
    border: none;
    padding: 15px 30px;
    font-weight: 500;
    font-size: 16px;
    color: #fff;
    background-color: #4caf50;
    border-radius: 5px;
    position: relative;
    overflow: hidden;
    cursor: pointer;
  }

  .buttonUI::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 300%;
    height: 300%;
    background-color: rgba(255, 255, 255, 0.3);
    transition: all 0.5s ease;
    border-radius: 50%;
    z-index: 0;
    transform: translate(-50%, -50%);
  }

  .buttonUI:hover::before {
    width: 0;
    height: 0;
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
