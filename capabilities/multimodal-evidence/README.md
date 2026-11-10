# multimodal-evidence

Authorized local media evidence using an existing external multimodal gateway.

## Contract

`inspect({gateway,file,allowedRoots,modality="image",timeoutMs=60000})` invokes an existing injected gateway after realpath containment, file type and 100MB size validation. Absolute local media paths only. Symlinks resolve before validation. Supports image/audio/video. Caller gateway must honor AbortSignal and enforce its own duration/frame/CPU limits and evidence provenance. Returns the normalized ok/partial/unknown/provider_error envelope. No OCR engine, model or worker is installed. Provider integration requires separately authorized local fixture validation.

## Verification

Run `node --test test/*.test.mjs` in this capability. Deterministic adapter tests exercise contract behavior. External provider and production state validation are separate.
