import assert from "node:assert/strict";
import test from "node:test";
import {
  getFinderOpenDirectoryTarget,
  getFinderPathSegments,
  getFinderProjectRootTarget,
} from "../lib/finder-path";

test("maps only Finder-supported terminal directories", () => {
  assert.equal(
    getFinderOpenDirectoryTarget("/Users/ranuputra/Desktop"),
    "/Users/ranuputra/Desktop"
  );
  assert.equal(getFinderOpenDirectoryTarget("/Applications"), "applications");
  assert.equal(getFinderOpenDirectoryTarget("/"), null);
  assert.equal(getFinderOpenDirectoryTarget("/System"), null);
});

test("opens only existing GitHub project roots", () => {
  assert.equal(
    getFinderProjectRootTarget(
      "/Users/ranuputra/Projects/alanagoyal",
      ["alanagoyal", "cli-crm"]
    ),
    "/Users/ranuputra/Projects/alanagoyal"
  );
  assert.equal(
    getFinderProjectRootTarget(
      "/Users/ranuputra/Projects/not-a-repo",
      ["alanagoyal", "cli-crm"]
    ),
    null
  );
  assert.equal(
    getFinderProjectRootTarget(
      "/Users/ranuputra/Projects/alanagoyal/components",
      ["alanagoyal"]
    ),
    null
  );
});

test("builds clickable segments from the Finder section root", () => {
  assert.deepEqual(
    getFinderPathSegments("/Users/ranuputra/Projects/alanagoyal/components/apps/finder"),
    [
      { label: "Projects", path: "/Users/ranuputra/Projects" },
      { label: "alanagoyal", path: "/Users/ranuputra/Projects/alanagoyal" },
      { label: "components", path: "/Users/ranuputra/Projects/alanagoyal/components" },
      { label: "apps", path: "/Users/ranuputra/Projects/alanagoyal/components/apps" },
      { label: "finder", path: "/Users/ranuputra/Projects/alanagoyal/components/apps/finder" },
    ]
  );
});

test("keeps local and virtual roots concise", () => {
  assert.deepEqual(getFinderPathSegments("/Users/ranuputra/Documents"), [
    { label: "Documents", path: "/Users/ranuputra/Documents" },
  ]);
  assert.deepEqual(getFinderPathSegments("trash/unused-assets"), [
    { label: "Trash", path: "trash" },
    { label: "unused-assets", path: "trash/unused-assets" },
  ]);
});
