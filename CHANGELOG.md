# Changelog

## [1.4.1](https://github.com/fugle-dev/fugle-marketdata-node/compare/v1.4.0...v1.4.1) (2026-01-12)


### Features

* **rest:** add corporate actions API endpoints ([e618d1c](https://github.com/fugle-dev/fugle-marketdata-node/commit/e618d1c777ef84cf6a0dfaade371d94bd3f2abf6))

# [1.4.0](https://github.com/fugle-dev/fugle-marketdata-node/compare/v1.3.2...v1.4.0) (2025-11-18)


### Bug Fixes

* export HealthCheckConfig and WebSocketClientOptions types ([ed1dfe9](https://github.com/fugle-dev/fugle-marketdata-node/commit/ed1dfe9194937b5fe8acaa02ea79f9cd29d90410))


### Features

* add WebSocket health check with ping/pong ([79d24ae](https://github.com/fugle-dev/fugle-marketdata-node/commit/79d24aeb61f671599c45942a6b00083d1b6e1b38))

## [1.3.2](https://github.com/fugle-dev/fugle-marketdata-node/compare/v1.3.1...v1.3.2) (2025-07-18)

## [1.3.1](https://github.com/fugle-dev/fugle-marketdata-node/compare/v1.3.0...v1.3.1) (2025-07-18)


### Bug Fixes

* resolve trailing slash issues in URL construction ([73fec19](https://github.com/fugle-dev/fugle-marketdata-node/commit/73fec194a0f6488563a9307700b143337c286391))


### Features

* add SDK token authentication and custom base ([fa4731f](https://github.com/fugle-dev/fugle-marketdata-node/commit/fa4731f58e214b36c0198a38285c037e0d737e5f))

# [1.3.0](https://github.com/fugle-dev/fugle-marketdata-node/compare/v1.2.0...v1.3.0) (2024-10-23)


### Features

* add REST endpoints for stock technical API ([#4](https://github.com/fugle-dev/fugle-marketdata-node/issues/4)) ([c5a51a8](https://github.com/fugle-dev/fugle-marketdata-node/commit/c5a51a8cd96a7aa069b11326231f4711484e48fc))
* add sort parameter to enable sorting for stock historical candles endpoint ([82225e7](https://github.com/fugle-dev/fugle-marketdata-node/commit/82225e7f9a414f1a6bf66e4cad03a2d675724b3b))

# [1.2.0](https://github.com/fugle-dev/fugle-marketdata-node/compare/v1.1.0...v1.2.0) (2024-07-30)


### Features

* add REST endpoints for Futures & Options API ([df5d392](https://github.com/fugle-dev/fugle-marketdata-node/commit/df5d3927f1b03cabe9d8bad6b7c8aa20710a63f6))
* add support for retrieving historical data for Futures and Options ([#3](https://github.com/fugle-dev/fugle-marketdata-node/issues/3)) ([7b92c67](https://github.com/fugle-dev/fugle-marketdata-node/commit/7b92c67eb97bd655266f23d907f670ea1f0792c4))

# [1.1.0](https://github.com/fugle-dev/fugle-marketdata-node/compare/v1.0.4...v1.1.0) (2024-03-01)


### Features

* add subscriptions method for WebSocket client ([5c28313](https://github.com/fugle-dev/fugle-marketdata-node/commit/5c28313da0d539ad9e7dd1e23ec2d83770fd6391))

## [1.0.4](https://github.com/fugle-dev/fugle-marketdata-node/compare/v1.0.3...v1.0.4) (2024-02-16)


### Bug Fixes

* correct the trading halt status property name ([af13910](https://github.com/fugle-dev/fugle-marketdata-node/commit/af139108f59254031f5e2092820262436a2c7b94))

## [1.0.3](https://github.com/fugle-dev/fugle-marketdata-node/compare/v1.0.2...v1.0.3) (2023-06-30)


### Bug Fixes

* expose WebSocket close event ([#2](https://github.com/fugle-dev/fugle-marketdata-node/issues/2)) ([f4ae32a](https://github.com/fugle-dev/fugle-marketdata-node/commit/f4ae32a231439948336a49e37c929254a5322fb2))

## [1.0.2](https://github.com/fugle-dev/fugle-marketdata-node/compare/v1.0.1...v1.0.2) (2023-06-24)


### Bug Fixes

* snapshot response interface doesn't match the response ([d5f45c3](https://github.com/fugle-dev/fugle-marketdata-node/commit/d5f45c39d9f487f53659be4fb5cb804bfa18d46b))

## [1.0.1](https://github.com/fugle-dev/fugle-marketdata-node/compare/v1.0.0...v1.0.1) (2023-06-22)


### Bug Fixes

* update stock intraday api response fields ([1cdfb90](https://github.com/fugle-dev/fugle-marketdata-node/commit/1cdfb905e52b576e725c0272275a7e6e81d3a345))

# [1.0.0](https://github.com/fugle-dev/fugle-marketdata-node/compare/v1.0.0-beta.1...v1.0.0) (2023-06-14)


### Features

* add ping method for WebSocket client ([32902f7](https://github.com/fugle-dev/fugle-marketdata-node/commit/32902f7c679f262fd67053b59e088c05ad0db9c7))

# [1.0.0-beta.1](https://github.com/fugle-dev/fugle-marketdata-node/compare/v1.0.0-beta.0...v1.0.0-beta.1) (2023-05-09)


### Features

* add unsubscribe method for WebSocket client ([3b13768](https://github.com/fugle-dev/fugle-marketdata-node/commit/3b13768825998ba9696c131db41a92e55f6b6bf9))

# 1.0.0-beta.0 (2023-04-02)


### Features

* add REST client support for Futures & Options API ([a48427b](https://github.com/fugle-dev/fugle-marketdata-node/commit/a48427b857c79235093d54fcda2257a3ad09b5a3))
* add REST client support for Stock API ([1f3e8cd](https://github.com/fugle-dev/fugle-marketdata-node/commit/1f3e8cd74a01d3cb7f2945d5c21c76bba9006a21))
* add WebSocket client support for Futures & Options API ([1cf3d94](https://github.com/fugle-dev/fugle-marketdata-node/commit/1cf3d94784373e455defa5b13aa1af9c045706a1))
* add WebSocket client support for Stock API ([a3fc242](https://github.com/fugle-dev/fugle-marketdata-node/commit/a3fc242242df178513fd57ff011367fe03367e07))