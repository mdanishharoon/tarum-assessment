{ pkgs ? import <nixpkgs> { } }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    # Runtime
    bun

    # Formatting
    treefmt
    prettier
    nixfmt

    # Git hooks
    lefthook
  ];

  shellHook = ''
    echo "tarum-assessment dev shell loaded"
    lefthook install
  '';
}
