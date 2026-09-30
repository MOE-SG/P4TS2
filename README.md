# P4/SP4 Data Checker

A browser app that checks P4/SP4 test data (CSV) against a limit file and gives you a pass/fail report with tables and plots.

It is one HTML page with no server and no install step. Your data file is read inside the browser and never uploaded anywhere.

## Try it

1. Open the app (`index.html`, or the GitHub Pages link for this repo).
2. The default limit file loads by itself.
3. Drop your test data CSV onto the **Test data** box, or click the box to browse.
   No data yet? Click **Try the sample**, or download [`sample_data.csv`](sample_data.csv). The values in it are made up.
4. The **Overall result** table shows pass/fail for every test and segment. Click any cell to open that test.
5. Pick a segment and test under **View**, then click **Show** to see its data table and plot.
6. Click **Print report**, then choose "Save as PDF" to keep a copy.

## What it checks

- Only the **last run** in the file is checked.
- For each segment, the app uses the limits for that segment's target temperature.
- A value passes when `low < value <= high`.
- The phase and RMS tests are normalised against a reference point before checking. For example, bandwidth phase is taken relative to the centre frequency, and phase-vs-amplitude is taken relative to the first amplitude step.
- A test shows **n/a** when the limit file has no limits for that test at that temperature. It shows an orange **error** when the data can't be checked, for example because the reference point is missing.
- The **Fail data** table lists every point that failed, with the measured value and its limits.
- **QuickTest** plots temperatures, sub-bus current and supply/DAC voltages against ELS for the whole run.

## Input file format

The test data must be a CSV file with a header row and exactly these 34 columns (the order doesn't matter):

```
RunNumber, Mother_SN, Daugther_SN, Cycle, Segment, TestType, TestID, ELS, SBV, TargSBV,
Time, Date, TargTemp, OvenTemp, ToolTemp, SubbusV, SubbusI, 3.6V, 11V, 6.8V,
DAC_0.0V, DAC_1.4V, DAC_2.2V, DAC_2.8V, DAC_4.3V, InFrequency, InAmp, InPhase,
ExPhase, StPhase, NearAGC, FarAGC, NearRMS, FarRMS
```

## Limit files

Limit files are CSV files with these columns:

```
targtemp, testtype, testid, refvalue, refcol, checkcol, high, low, testname
```

The app downloads the published limit files from GitHub, and you can pick which one to use from the **Limits** list. To use a limit file that isn't published, choose **Load a limit file from my computer…**.

## Install and offline use

The app can be installed like a regular app:

- **Chrome / Edge (PC):** click **Install app** in the top bar, or use the install icon in the address bar.
- **Android:** browser menu, then **Add to Home screen** / **Install app**.
- **iPhone / iPad (Safari):** Share, then **Add to Home Screen**.

After the first visit, the app and the limit files you have used are cached, so the app still works without a network connection. When you are online it always fetches the latest version.

Install and offline mode need the app to be served over `https://`, for example from GitHub Pages. If you open `index.html` straight from disk, the app still works, but it can't be installed.

## Hosting on GitHub Pages

1. Put these files in the root of a repository:
   ```
   index.html
   manifest.webmanifest
   sw.js
   sample_data.csv
   icons/icon.svg
   icons/icon-192.png
   icons/icon-512.png
   README.md
   ```
2. In the repo, go to **Settings → Pages**, set the source to the `main` branch and `/ (root)`, and save.
3. The app will be live at `https://<user>.github.io/<repo>/` within a minute or two.

When you publish changes, bump `CACHE` in `sw.js` (for example `v1` to `v2`) so installed copies drop old cached files.

## Files

| File | Purpose |
|---|---|
| `index.html` | The whole app: checking logic, UI and charts. No external libraries. |
| `manifest.webmanifest` | App name, icons and colours used when installing |
| `sw.js` | Service worker that lets the app work offline |
| `sample_data.csv` | Made-up example data for trying the app |
| `icons/` | App icons |
