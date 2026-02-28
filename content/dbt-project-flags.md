---
title: dbt_project.yml flags 設定リファレンス
draft: false
tags:
  - dbt
  - best-practices
  - data-engineering
date: 2026-02-28
authorship:
  type: ai-assisted
  model: Claude Sonnet 4.6
  date: 2026-02-28
  reviewed: false
---

**調査日**: 2026-02-28
**対象バージョン**: dbt Core 1.6 〜 1.12（dbt Cloud 2024.03 〜 2026.01）

---

## 概要

`flags`（グローバルコンフィグ）は、dbt がプロジェクトをどのように実行するかを制御する設定です。「何を実行するか」（モデルの定義）ではなく「どう実行するか」（ログ出力方法、エラー処理など）を指定します。

`dbt_project.yml` の `flags:` セクションに記述することで、設定をバージョン管理下に置けます。

---

## 目次

1. [設定優先順位](#1-設定優先順位)
2. [一般フラグ（Project Flags）](#2-一般フラグproject-flags)
3. [動作変更フラグ（Behavior Change Flags）](#3-動作変更フラグbehavior-change-flags)
4. [バージョン別導入履歴](#4-バージョン別導入履歴)
5. [実際の使用例](#5-実際の使用例)

---

## 1. 設定優先順位

同じフラグを複数の場所で設定した場合、以下の優先順位で解決されます（高い順）：

```text
CLI オプション
  > 環境変数
    > dbt_project.yml の flags
      > dbt ハードコードデフォルト
```

### 設定できないフラグ

ファイルパス系フラグ（`--log-path`、`--state` など）は `dbt_project.yml` に設定できません。

また、動作変更フラグ（Behavior Change Flags）はバージョン管理の観点から `dbt_project.yml` **のみ**に設定することが推奨されています。

---

## 2. 一般フラグ（Project Flags）

### 基本構文

```yaml
# dbt_project.yml
flags:
  partial_parse: true
  send_anonymous_usage_stats: false
```

### フラグ一覧

| フラグ名                     | 型      | デフォルト | 環境変数                         | 説明                                                                           |
| ---------------------------- | ------- | ---------- | -------------------------------- | ------------------------------------------------------------------------------ |
| `cache_selected_only`        | boolean | `false`    | `DBT_CACHE_SELECTED_ONLY`        | 選択されたモデルのみキャッシュ対象にする                                       |
| `debug`                      | boolean | `false`    | `DBT_DEBUG`                      | デバッグレベルのログ出力を有効化する                                           |
| `fail_fast`                  | boolean | `false`    | `DBT_FAIL_FAST`                  | 最初のエラーで即座に停止する（`-x` と同等）                                    |
| `full_refresh`               | boolean | `false`    | —                                | Incremental モデルをフルリビルドする                                           |
| `indirect_selection`         | enum    | `eager`    | `DBT_INDIRECT_SELECTION`         | テスト選択の間接選択動作を制御（`eager` / `cautious` / `buildable` / `empty`） |
| `log_format`                 | enum    | `default`  | `DBT_LOG_FORMAT`                 | コンソールログのフォーマット（`default` / `json` / `text`）                    |
| `log_format_file`            | enum    | `default`  | `DBT_LOG_FORMAT_FILE`            | ファイルログのフォーマット                                                     |
| `log_level`                  | enum    | `info`     | `DBT_LOG_LEVEL`                  | コンソールログの詳細度（`debug` / `info` / `warn` / `error` / `none`）         |
| `log_level_file`             | enum    | `debug`    | `DBT_LOG_LEVEL_FILE`             | ファイルログの詳細度                                                           |
| `partial_parse`              | boolean | `true`     | `DBT_PARTIAL_PARSE`              | 増分プロジェクトパーシングを有効化（起動高速化）                               |
| `populate_cache`             | boolean | `true`     | `DBT_POPULATE_CACHE`             | 実行開始時にリレーショナルキャッシュを構築する                                 |
| `printer_width`              | int     | `80`       | —                                | コンソール出力の幅（文字数）                                                   |
| `send_anonymous_usage_stats` | boolean | `true`     | `DBT_SEND_ANONYMOUS_USAGE_STATS` | dbt Labs への匿名使用統計送信（`DO_NOT_TRACK=1` でも無効化可能）               |
| `static_parser`              | boolean | `true`     | —                                | 静的パーシングアプローチを使用する                                             |
| `use_colors`                 | boolean | `true`     | `DBT_USE_COLORS`                 | コンソール出力のカラー表示を有効化する                                         |
| `use_colors_file`            | boolean | `true`     | —                                | ログファイルのカラー表示を有効化する                                           |
| `use_experimental_parser`    | boolean | `false`    | —                                | 実験的パーシング機能を有効化する                                               |
| `version_check`              | boolean | varies     | `DBT_VERSION_CHECK`              | dbt バージョン互換性チェックを行う                                             |
| `warn_error`                 | boolean | `false`    | `DBT_WARN_ERROR`                 | 警告をエラーとして扱う                                                         |
| `warn_error_options`         | object  | —          | `DBT_WARN_ERROR_OPTIONS`         | 警告/エラー変換を細かく制御する                                                |
| `write_json`                 | boolean | `true`     | —                                | JSON アーティファクト（`manifest.json` 等）を生成する                          |

### 各フラグの詳細

#### `partial_parse`（デフォルト: `true`）

前回の実行結果をキャッシュして増分パーシングを行います。変更されていないファイルは再パースしないため起動が高速になります。

```yaml
flags:
  partial_parse: true
```

CIなどでキャッシュが問題を引き起こす場合は `false` に設定します。

---

#### `warn_error` / `warn_error_options`（デフォルト: `false`）

`warn_error: true` は警告をすべてエラーとして扱います。`warn_error_options` を使うと特定の警告のみをエラーや無視に設定できます。

```yaml
flags:
  warn_error: false
  warn_error_options:
    error:
      - NoNodesForSelectionCriteria
    silence:
      - DeprecatedModel
```

---

#### `fail_fast`（デフォルト: `false`）

最初のエラーが発生した時点でジョブ全体を停止します。CI/CD でフィードバックを速くしたい場合に有効です。

```yaml
flags:
  fail_fast: true
```

---

#### `send_anonymous_usage_stats`（デフォルト: `true`）

dbt Labs に匿名の使用統計を送信するかどうかを制御します。ネットワーク制限がある環境や社内ポリシーで外部送信が禁止されている場合は `false` にします。

```yaml
flags:
  send_anonymous_usage_stats: false
```

---

#### `indirect_selection`（デフォルト: `eager`）

`--select` でモデルを選択した際に、そのモデルに紐づくテストをどこまで選択するかを制御します。

| 値          | 動作                                                                   |
| ----------- | ---------------------------------------------------------------------- |
| `eager`     | 選択モデルに関連するすべてのテストを実行（デフォルト）                 |
| `cautious`  | 選択モデルのみをテスト対象にする（未選択モデルを含むテストはスキップ） |
| `buildable` | 選択モデルとその上流が実行済みのテストのみ対象                         |
| `empty`     | テストを一切選択しない                                                 |

```yaml
flags:
  indirect_selection: cautious
```

---

## 3. 動作変更フラグ（Behavior Change Flags）

新機能への段階的な移行を管理するためのフラグです。古い挙動から新しい挙動へ安全に移行できます。

### ライフサイクル

```text
Phase 1（導入）:   フラグ追加 → デフォルト false（旧挙動を維持）
                   早期採用者はオプトインして新挙動を使用可能
                         ↓
Phase 2（成熟）:   デフォルト true に変更（新挙動がデフォルト）
                   false に設定することで一時的に旧挙動に戻せる
                         ↓
Phase 3（削除）:   フラグとコードを削除、常に新挙動が適用される
```

dbt Fusion では、すべての Behavior Change Flags が削除済みで、常に新しい動作が適用されます。

### Behavior Change Flags 一覧

| フラグ名                                                          | デフォルト | 導入バージョン | デフォルト true 化 | Fusion |
| ----------------------------------------------------------------- | ---------- | -------------- | ------------------ | ------ |
| `require_explicit_package_overrides_for_builtin_materializations` | `true`     | Core 1.6.14    | Core 1.8.0         | 削除済 |
| `require_resource_names_without_spaces`                           | `true`     | Core 1.8.0     | Core 1.10.0        | 削除済 |
| `source_freshness_run_project_hooks`                              | `true`     | Core 1.8.0     | Core 1.10.0        | 削除済 |
| `skip_nodes_if_on_run_start_fails`                                | `false`    | Core 1.9.0     | TBD                | 削除済 |
| `state_modified_compare_more_unrendered_values`                   | `false`    | Core 1.9.0     | TBD                | 削除済 |
| `require_yaml_configuration_for_mf_time_spines`                   | `false`    | Core 1.9.0     | TBD                | 削除済 |
| `require_batched_execution_for_custom_microbatch_strategy`        | `false`    | Core 1.9.0     | TBD                | 削除済 |
| `require_nested_cumulative_type_params`                           | `false`    | Core 1.9.0     | TBD                | 未対応 |
| `validate_macro_args`                                             | `false`    | Core 1.10.0    | TBD                | 未対応 |
| `require_all_warnings_handled_by_warn_error`                      | `false`    | Core 1.10.0    | TBD                | 未対応 |
| `require_generic_test_arguments_property`                         | `true`     | Core 1.10.5    | Core 1.10.8        | 未対応 |
| `require_unique_project_resource_names`                           | `false`    | Core 1.11.0    | TBD                | 未対応 |
| `require_ref_searches_node_package_before_root`                   | `false`    | Core 1.11.0    | TBD                | 未対応 |
| `require_valid_schema_from_generate_schema_name`                  | `false`    | Core 1.12.0a1  | TBD                | 未対応 |

### 各フラグの詳細

#### `require_explicit_package_overrides_for_builtin_materializations`

- **導入**: Core 1.6.14（dbt Cloud 2024.04）
- **デフォルト true 化**: Core 1.8.0（dbt Cloud 2024.06）
- **Fusion**: 削除済み

**内容**: インストール済みパッケージが暗黙的にビルトインマテリアライゼーション（`table`、`view`、`incremental` など）を上書きするのを防ぎます。

- `false`（旧挙動）: パッケージが自動的にビルトインマテリアライゼーションを上書き可能
- `true`（新挙動）: 明示的な設定なしにパッケージが上書きするとエラー

```yaml
flags:
  require_explicit_package_overrides_for_builtin_materializations: true
```

---

#### `require_resource_names_without_spaces`

- **導入**: Core 1.8.0（dbt Cloud 2024.05）
- **デフォルト true 化**: Core 1.10.0（dbt Cloud 2025.05）
- **Fusion**: 削除済み

**内容**: リソース名（モデル名、テスト名など）に英数字とアンダースコアのみを使用することを強制します。

- `false`（旧挙動）: スペースを含むリソース名を許容
- `true`（新挙動）: スペースを含む名前はパースエラー

```yaml
flags:
  require_resource_names_without_spaces: true
```

---

#### `source_freshness_run_project_hooks`

- **導入**: Core 1.8.0（dbt Cloud 2024.03）
- **デフォルト true 化**: Core 1.10.0（dbt Cloud 2025.05）
- **Fusion**: 削除済み

**内容**: `dbt source freshness` 実行時に `on-run-start` / `on-run-end` プロジェクトフックを含めるかを制御します。

- `false`（旧挙動）: freshness チェック時にフックをスキップ
- `true`（新挙動）: freshness チェック時もフックを実行

```yaml
flags:
  source_freshness_run_project_hooks: true
```

---

#### `skip_nodes_if_on_run_start_fails`

- **導入**: Core 1.9.0（dbt Cloud 2024.10）
- **Fusion**: 削除済み

**内容**: `on-run-start` フックが失敗した場合、選択されたすべてのリソースの実行をスキップします。

- `false`（旧挙動）: フック失敗後もモデル実行を継続
- `true`（新挙動）: フック失敗時に選択済みリソースをスキップ

CI/CD環境でフックの失敗を早期に検知したい場合に有効です。

```yaml
flags:
  skip_nodes_if_on_run_start_fails: true
```

---

#### `state_modified_compare_more_unrendered_values`

- **導入**: Core 1.9.0（dbt Cloud 2024.10）
- **Fusion**: 削除済み

**内容**: `state:modified` チェック時に、レンダリング済みの値ではなく未レンダリング値（Jinja テンプレートのソースコード）を比較します。環境変数などによる false positive（誤検知）を削減できます。

- `false`（旧挙動）: レンダリング済み値で比較 → 環境差異による誤検知が発生しやすい
- `true`（新挙動）: 未レンダリング値で比較 → より正確な差分検出

CI/CD で `state:modified` を使っている場合、このフラグを `true` にすることで不要な再実行を削減できます。

```yaml
flags:
  state_modified_compare_more_unrendered_values: true
```

---

#### `require_yaml_configuration_for_mf_time_spines`

- **導入**: Core 1.9.0（dbt Cloud 2024.10）

**内容**: MetricFlow のタイムスパイン設定を YAML 形式で記述することを強制します。従来の Python ベース設定からの移行を促します。

```yaml
flags:
  require_yaml_configuration_for_mf_time_spines: true
```

---

#### `require_batched_execution_for_custom_microbatch_strategy`

- **導入**: Core 1.9.0（dbt Cloud 2024.11）
- **Fusion**: 削除済み

**内容**: カスタムマイクロバッチ戦略（`get_batch_size` マクロなど）を持つプロジェクトで、バッチ実行を強制します。カスタムマイクロバッチマクロを定義している場合は `true` に設定することが推奨されます。

```yaml
flags:
  require_batched_execution_for_custom_microbatch_strategy: true
```

---

#### `require_nested_cumulative_type_params`

- **導入**: Core 1.9.0（dbt Cloud 2024.11）

**内容**: 累積メトリクスのパラメータを `cumulative_type_params` 配下にネスト形式で記述することを強制します。

- `false`（旧挙動）: フラットな形式で記述可能
- `true`（新挙動）: `cumulative_type_params` 配下にネスト必須

```yaml
# true にした場合の記述形式
metrics:
  - name: cumulative_revenue
    type: cumulative
    type_params:
      cumulative_type_params:
        period: all_time
```

```yaml
flags:
  require_nested_cumulative_type_params: true
```

---

#### `validate_macro_args`

- **導入**: Core 1.10.0（dbt Cloud 2025.03）

**内容**: パース時にマクロの引数名と型を検証します。引数の定義と呼び出しが一致しない場合にエラーを発生させます。

```yaml
flags:
  validate_macro_args: true
```

---

#### `require_all_warnings_handled_by_warn_error`

- **導入**: Core 1.10.0（dbt Cloud 2025.06）

**内容**: すべての警告を `warn_error_options` ハンドラー経由でルーティングすることを要求します。未処理の警告がある場合にエラーを発生させます。

```yaml
flags:
  require_all_warnings_handled_by_warn_error: true
```

---

#### `require_generic_test_arguments_property`

- **導入**: Core 1.10.5（dbt Cloud 2025.07）
- **デフォルト true 化**: Core 1.10.8（dbt Cloud 2025.08）

**内容**: ジェネリックテストのキーバリュー引数を `arguments` プロパティ配下でパースすることを要求します。

```yaml
flags:
  require_generic_test_arguments_property: true
```

---

#### `require_unique_project_resource_names`

- **導入**: Core 1.11.0（dbt Cloud 2025.12）

**内容**: 同一パッケージ内でリソース名のユニーク性を強制します。重複がある場合は `DuplicateResourceNameError` が発生します。

```yaml
flags:
  require_unique_project_resource_names: true
```

---

#### `require_ref_searches_node_package_before_root`

- **導入**: Core 1.11.0（dbt Cloud 2025.12）

**内容**: `ref()` の名前解決時に、ルートプロジェクトより先にモデルが定義されているパッケージを検索します。パッケージ間の名前解決の一貫性が向上します。

```yaml
flags:
  require_ref_searches_node_package_before_root: true
```

---

#### `require_valid_schema_from_generate_schema_name`

- **導入**: Core 1.12.0a1（dbt Cloud 2026.01）

**内容**: カスタム `generate_schema_name` マクロが有効なスキーマ名（`null` 以外）を返すことを強制します。

```yaml
flags:
  require_valid_schema_from_generate_schema_name: true
```

---

## 4. バージョン別導入履歴

| dbt Core | dbt Cloud   | 導入されたフラグ                                                                                                                                                                                                                          |
| -------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.6.14   | 2024.04     | `require_explicit_package_overrides_for_builtin_materializations`                                                                                                                                                                         |
| 1.8.0    | 2024.05〜06 | `require_resource_names_without_spaces`、`source_freshness_run_project_hooks`                                                                                                                                                             |
| 1.9.0    | 2024.10〜11 | `skip_nodes_if_on_run_start_fails`、`state_modified_compare_more_unrendered_values`、`require_yaml_configuration_for_mf_time_spines`、`require_batched_execution_for_custom_microbatch_strategy`、`require_nested_cumulative_type_params` |
| 1.10.0   | 2025.03〜06 | `validate_macro_args`、`require_all_warnings_handled_by_warn_error`                                                                                                                                                                       |
| 1.10.5   | 2025.07     | `require_generic_test_arguments_property`                                                                                                                                                                                                 |
| 1.11.0   | 2025.12     | `require_unique_project_resource_names`、`require_ref_searches_node_package_before_root`                                                                                                                                                  |
| 1.12.0a1 | 2026.01     | `require_valid_schema_from_generate_schema_name`                                                                                                                                                                                          |

---

## 5. 実際の使用例

### Core 1.9.x 本番環境

```yaml
name: my_project
version: "1.0.0"
config-version: 2

profile: default

flags:
  # テレメトリ
  send_anonymous_usage_stats: false

  # パーシング最適化
  partial_parse: true

  # 出力設定
  use_colors: true
  printer_width: 120

  # アーティファクト生成
  write_json: true

  # 1.9.0 で導入（推奨設定）
  skip_nodes_if_on_run_start_fails: true
  state_modified_compare_more_unrendered_values: true
```

### Core 1.10.x へのアップグレード時

1.10.0 でデフォルトが `true` に変わったフラグを確認し、既存プロジェクトへの影響を評価します。

```yaml
flags:
  # 1.10.0 でデフォルト true 化（影響があれば false に戻して移行猶予を確保）
  require_resource_names_without_spaces: false # スペース含む名前を一時的に許容
  source_freshness_run_project_hooks: false # freshness 時にフックをスキップ

  # 1.10.0 で新規導入（準備ができたら true に）
  validate_macro_args: false
```

### dbt-project-evaluator の実例

[dbt-labs/dbt-project-evaluator](https://github.com/dbt-labs/dbt-project-evaluator) の設定例：

```yaml
flags:
  require_nested_cumulative_type_params: true
  require_yaml_configuration_for_mf_time_spines: true
  require_generic_test_arguments_property: true
```

### CI/CD で state:modified を活用する場合

誤検知削減のために `state_modified_compare_more_unrendered_values` を有効化します。

```yaml
flags:
  state_modified_compare_more_unrendered_values: true
  skip_nodes_if_on_run_start_fails: true
  partial_parse: true
  write_json: true
```

---

## 参照

- [dbt: Behavior changes](https://docs.getdbt.com/reference/global-configs/behavior-changes)
- [dbt: About flags (global configs)](https://docs.getdbt.com/reference/global-configs/about-global-configs)
- [dbt: Project flags](https://docs.getdbt.com/reference/global-configs/project-flags)
- [dbt: dbt_project.yml](https://docs.getdbt.com/reference/dbt_project.yml)
- [dbt-labs/dbt-project-evaluator: dbt_project.yml](https://github.com/dbt-labs/dbt-project-evaluator/blob/main/integration_tests/dbt_project.yml)
