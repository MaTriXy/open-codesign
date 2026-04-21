cask "open-codesign" do
  version "0.1.2"
  sha256 arm:   "REPLACED_BY_RELEASE_WORKFLOW_ARM64",
         intel: "REPLACED_BY_RELEASE_WORKFLOW_X64"

  url "https://github.com/OpenCoworkAI/open-codesign/releases/download/v#{version}/open-codesign-#{version}-#{Hardware::CPU.arm? ? "arm64" : "x64"}.dmg",
      verified: "github.com/OpenCoworkAI/open-codesign/"
  name "Open CoDesign"
  desc "Turn a prompt into a polished HTML prototype, slide deck, or asset"
  homepage "https://opencoworkai.github.io/open-codesign/"

  livecheck do
    url :url
    strategy :github_latest
  end

  auto_updates false
  depends_on macos: ">= :big_sur"

  app "open-codesign.app"

  zap trash: [
    "~/Library/Application Support/open-codesign",
    "~/Library/Logs/open-codesign",
    "~/Library/Preferences/ai.opencowork.codesign.plist",
    "~/Library/Saved Application State/ai.opencowork.codesign.savedState",
  ]
end
