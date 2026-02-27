---
title: dbt品質保証ツール - 全チェックルール詳細リスト
draft: false
tags:
  - dbt
  - best-practices
  - testing
date: 2026-02-26
authorship:
  type: ai-assisted
  model: Claude Sonnet 4.6
  date: 2026-02-27
  reviewed: false
---

**作成日**: 2026-02-26
**更新日**: 2026-02-27
**目的**: 各dbt品質保証ツールの全チェックルール・フック・テストを説明付きで網羅的にリスト化

---

## 目次

1. [サマリー](#サマリー)
2. [dbt-bouncer (81ルール)](#dbt-bouncer-81ルール)
3. [dbt-checkpoint (62フック)](#dbt-checkpoint-62フック)
4. [dbt-project-evaluator (29テスト)](#dbt-project-evaluator-29テスト)
5. [dbt-score (18ルール)](#dbt-score-18ルール)
6. [カテゴリ別集計](#カテゴリ別集計)

---

## サマリー

| ツール                    | 総数    | 取得元              | リポジトリ                                                                          |
| ------------------------- | ------- | ------------------- | ----------------------------------------------------------------------------------- |
| **dbt-bouncer**           | 81      | Checkクラス         | [godatadriven/dbt-bouncer](https://github.com/godatadriven/dbt-bouncer)             |
| **dbt-checkpoint**        | 62      | フックID            | [dbt-checkpoint/dbt-checkpoint](https://github.com/dbt-checkpoint/dbt-checkpoint)   |
| **dbt-project-evaluator** | 29      | Factモデル          | [dbt-labs/dbt-project-evaluator](https://github.com/dbt-labs/dbt-project-evaluator) |
| **dbt-score**             | 18      | @ruleデコレータ関数 | [PicnicSupermarket/dbt-score](https://github.com/PicnicSupermarket/dbt-score)       |
| **合計**                  | **190** | -                   | -                                                                                   |

---

## dbt-bouncer (81ルール)

**リポジトリ**: https://github.com/godatadriven/dbt-bouncer
**ドキュメント**: https://godatadriven.github.io/dbt-bouncer/

### 📊 カテゴリ別内訳

- **Catalog Checks** (カラム): 6ルール
- **Manifest - Exposures**: 3ルール
- **Manifest - Lineage**: 3ルール
- **Manifest - Macros**: 6ルール
- **Manifest - Metadata**: 1ルール
- **Manifest - Models**: 36ルール
- **Manifest - Seeds**: 6ルール
- **Manifest - Semantic Models**: 1ルール
- **Manifest - Snapshots**: 2ルール
- **Manifest - Sources**: 11ルール
- **Manifest - Tests**: 1ルール
- **Manifest - Unit Tests**: 3ルール
- **Run Results Checks**: 2ルール

---

### Catalog Checks - カラム (6ルール)

1. **CheckColumnDescriptionPopulated**
   - カラムに説明が記載されている必要があります。

2. **CheckColumnHasSpecifiedTest**
   - 指定された正規表現パターンに一致するカラムは、指定されたテストを持つ必要があります。

3. **CheckColumnNameCompliesToColumnType**
   - 指定された正規表現の命名パターンを持つカラムは、指定された正規表現パターンまたはデータ型のリストに準拠したデータ型を持つ必要があります。

4. **CheckColumnNames**
   - カラム名は指定された正規表現パターンに一致する必要があります。

5. **CheckColumnsAreAllDocumented**
   - モデルのすべてのカラムは、モデルのプロパティファイル（`.yml`ファイル）に含まれている必要があります。

6. **CheckColumnsAreDocumentedInPublicModels**
   - publicモデルのカラムには説明が記載されている必要があります。

---

### Manifest Checks - Exposures (3ルール)

1. **CheckExposureBasedOnModel**
   - エクスポージャーはモデルに依存している必要があります。

2. **CheckExposureBasedOnView**
   - エクスポージャーはビューに基づいていてはいけません。

3. **CheckExposureOnNonPublicModels**
   - エクスポージャーはpublicモデルのみに基づいている必要があります。

---

### Manifest Checks - Lineage (3ルール)

1. **CheckLineagePermittedUpstreamModels**
   - 上流モデルは、指定された`upstream_path_pattern`に一致するパスを持つ必要があります。

2. **CheckLineageSeedCannotBeUsed**
   - 指定された`include`設定に一致するパスを持つモデルでは、シードを参照できません。

3. **CheckLineageSourceCannotBeUsed**
   - 指定された`include`設定に一致するパスを持つモデルでは、ソースを参照できません。

---

### Manifest Checks - Macros (6ルール)

1. **CheckMacroArgumentsDescriptionPopulated**
   - マクロの引数には説明が記載されている必要があります。

2. **CheckMacroCodeDoesNotContainRegexpPattern**
   - マクロの生コードは、指定された正規表現パターンに一致してはいけません。

3. **CheckMacroDescriptionPopulated**
   - マクロには説明が記載されている必要があります。

4. **CheckMacroMaxNumberOfLines**
   - マクロは指定された行数を超えてはいけません。

5. **CheckMacroNameMatchesFileName**
   - マクロ名は、マクロが含まれているファイル名と同じである必要があります。

6. **CheckMacroPropertyFileLocation**
   - マクロのプロパティファイルは、dbtベストプラクティスで提供されているガイダンスに従う必要があります。

---

### Manifest Checks - Metadata (1ルール)

1. **CheckProjectName**
   - dbtプロジェクトの名前が指定された正規表現に一致することを強制します。

---

### Manifest Checks - Models (36ルール)

1. **CheckModelAccess**
   - モデルは指定されたアクセス属性を持つ必要があります。dbt 1.7以上が必要です。

2. **CheckModelCodeDoesNotContainRegexpPattern**
   - モデルの生コードは、指定された正規表現パターンに一致してはいけません。

3. **CheckModelColumnsHaveMetaKeys**
   - モデルに定義されたカラムは、`meta`設定で指定されたキーを持つ必要があります。

4. **CheckModelColumnsHaveTypes**
   - モデルに定義されたカラムは、`data_type`を宣言する必要があります。

5. **CheckModelContractEnforcedForPublicModel**
   - publicモデルはコントラクトが強制されている必要があります。

6. **CheckModelDependsOnMacros**
   - モデルは指定されたマクロに依存している必要があります。

7. **CheckModelDependsOnMultipleSources**
   - モデルは複数のソースを参照できません。

8. **CheckModelDescriptionContainsRegexPattern**
   - モデルの説明は、指定されたパターンに一致する必要があります。

9. **CheckModelDescriptionPopulated**
   - モデルには説明が記載されている必要があります。

10. **CheckModelDirectories**

- 指定されたサブディレクトリのみが許可されます。

11. **CheckModelDocumentationCoverage**

- 説明が記載されているモデルの最小パーセンテージを設定します。

12. **CheckModelDocumentedInSameDirectory**

- モデルは、定義されているのと同じディレクトリでドキュメント化されている必要があります（つまり、`.yml`ファイルと`.sql`ファイルが同じディレクトリにあること）。

13. **CheckModelFileName**

- モデルのファイル名はモデル名と一致する必要があります。

14. **CheckModelGrantPrivilege**

- モデルは、指定されたパターンに一致する権限を付与できます。

15. **CheckModelGrantPrivilegeRequired**

- モデルは、指定された権限を付与する必要があります。

16. **CheckModelHasConstraints**

- テーブルモデルとインクリメンタルモデルは、指定された制約タイプが定義されている必要があります。

17. **CheckModelHasContractsEnforced**

- モデルはコントラクトが強制されている必要があります。

18. **CheckModelHasExposure**

- モデルはエクスポージャーを持つ必要があります。

19. **CheckModelHasMetaKeys**

- モデルの`meta`設定には、指定されたキーが含まれている必要があります。

20. **CheckModelHasNoUpstreamDependencies**

- モデルに上流の依存関係がない場合を特定します。これはハードコードされたテーブル参照を示している可能性があります。

21. **CheckModelHasSemiColon**

- モデルはセミコロン（`;`）で終わってはいけません。

22. **CheckModelHasTags**

- モデルは指定されたタグを持つ必要があります。

23. **CheckModelHasUniqueTest**

- モデルはカラムの一意性テストを持つ必要があります。

24. **CheckModelHasUnitTests**

- モデルは指定された数以上のユニットテストを持つ必要があります。

25. **CheckModelLatestVersionSpecified**

- モデルは最新バージョンを指定する必要があります。

26. **CheckModelMaxChainedViews**

- モデルは、テーブルでない上流の依存関係を指定された数以上持つことができません。

27. **CheckModelMaxFanout**

- モデルは、指定された数以上の下流モデルを持つことができません。

28. **CheckModelMaxNumberOfLines**

- モデルは指定された行数を超えてはいけません。

29. **CheckModelMaxUpstreamDependencies**

- モデルが持つ上流の依存関係の数を制限します。

30. **CheckModelNames**

- モデル名は指定された正規表現パターンに一致する必要があります。

31. **CheckModelNumberOfGrants**

- モデルは指定された数の権限を持つことができます。

32. **CheckModelPropertyFileLocation**

- モデルのプロパティファイルは、dbtベストプラクティスで提供されているガイダンスに従う必要があります。

33. **CheckModelSchemaName**

- モデルのスキーマ名は、指定された正規表現パターンに一致する必要があります。

34. **CheckModelTestCoverage**

- 少なくとも1つのテストを持つモデルの最小パーセンテージを設定します。

35. **CheckModelVersionAllowed**

- 許可されたモデルバージョンのみが許可されます。

36. **CheckModelVersionPinnedInRef**

- バージョン管理されたモデルが存在する場合、モデル参照はバージョンを指定する必要があります。

---

### Manifest Checks - Seeds (6ルール)

1. **CheckSeedColumnNames**
   - シードのカラム名は、指定された正規表現パターンに一致する必要があります。

2. **CheckSeedColumnsAreAllDocumented**
   - シードCSVファイルのすべてのカラムは、シードのプロパティファイル（`.yml`ファイル）に含まれている必要があります。

3. **CheckSeedColumnsHaveTypes**
   - シードに定義されたカラムは、`data_type`を宣言する必要があります。

4. **CheckSeedDescriptionPopulated**
   - シードには説明が記載されている必要があります。

5. **CheckSeedHasUnitTests**
   - シードは指定された数以上のユニットテストを持つ必要があります。

6. **CheckSeedNames**
   - シード名は指定された正規表現パターンに一致する必要があります。

---

### Manifest Checks - Semantic Models (1ルール)

1. **CheckSemanticModelBasedOnNonPublicModels**
   - セマンティックモデルはpublicモデルのみに基づいている必要があります。

---

### Manifest Checks - Snapshots (2ルール)

1. **CheckSnapshotHasTags**
   - スナップショットは指定されたタグを持つ必要があります。

2. **CheckSnapshotNames**
   - スナップショット名は指定された正規表現パターンに一致する必要があります。

---

### Manifest Checks - Sources (11ルール)

1. **CheckSourceColumnsAreAllDocumented**
   - ソースのすべてのカラムは、ソースのプロパティファイル（`.yml`ファイル）に含まれている必要があります。

2. **CheckSourceDescriptionPopulated**
   - ソースには説明が記載されている必要があります。

3. **CheckSourceFreshnessPopulated**
   - ソースにはフレッシュネス設定が記載されている必要があります。

4. **CheckSourceHasMetaKeys**
   - ソースの`meta`設定には、指定されたキーが含まれている必要があります。

5. **CheckSourceHasTags**
   - ソースは指定されたタグを持つ必要があります。

6. **CheckSourceLoaderPopulated**
   - ソースにはローダー情報が記載されている必要があります。

7. **CheckSourceNames**
   - ソース名は指定された正規表現パターンに一致する必要があります。

8. **CheckSourceNotOrphaned**
   - ソースは少なくとも1つのモデルで参照されている必要があります。

9. **CheckSourcePropertyFileLocation**
   - ソースのプロパティファイルは、dbtベストプラクティスで提供されているガイダンスに従う必要があります。

10. **CheckSourceUsedByModelsInSameDirectory**

- ソースは、ソースが定義されているのと同じディレクトリに配置されているモデルからのみ参照できます。

11. **CheckSourceUsedByOnlyOneModel**

- 各ソースは最大1つのモデルでのみ参照できます。

---

### Manifest Checks - Tests (1ルール)

1. **CheckTestHasTags**
   - データテストは指定されたタグを持つ必要があります。

---

### Manifest Checks - Unit Tests (3ルール)

1. **CheckUnitTestCoverage**
   - ユニットテストを持つモデルの最小パーセンテージを設定します。

2. **CheckUnitTestExpectFormat**
   - ユニットテストは指定されたフォーマットのみを使用できます。

3. **CheckUnitTestGivenFormats**
   - ユニットテストは指定されたフォーマットのみを使用できます。

---

### Run Results Checks (2ルール)

1. **CheckRunResultsMaxExecutionTime**
   - 各結果は最大実行時間（秒）を持つことができます。

2. **CheckRunResultsMaxGigabytesBilled**
   - 各結果は最大課金ギガバイト数を持つことができます。

---

## dbt-checkpoint (62フック)

**リポジトリ**: https://github.com/dbt-checkpoint/dbt-checkpoint
**ドキュメント**: [HOOKS.md](https://github.com/dbt-checkpoint/dbt-checkpoint/blob/main/HOOKS.md)

### 📊 カテゴリ別内訳

- **Column Checks**: 3フック
- **Database Checks**: 1フック
- **Exposure Checks**: 1フック
- **Macro Checks**: 3フック
- **Model Checks**: 23フック
- **Script/SQL Checks**: 6フック
- **Seed Checks**: 1フック
- **Snapshot Checks**: 1フック
- **Source Checks**: 14フック
- **Test Checks**: 2フック
- **dbt Commands**: 7フック

---

### Column Checks (3フック)

1. **check-column-desc-are-same**
   - モデル間でカラムの説明が同じであることをチェックします。

2. **check-column-name-contract**
   - カラム名が命名規則に準拠していることをチェックします。

3. **unify-column-description**
   - すべてのモデルでカラムの説明を統一します。

---

### Database Checks (1フック)

1. **check-database-casing-consistency**
   - マニフェストとカタログを比較して、データベースとスキーマが同じ大文字小文字を持つことを確認します。

---

### Exposure Checks (1フック)

1. **check-exposure-has-meta-keys**
   - エクスポージャーがメタキーを持つことをチェックします。

---

### Macro Checks (3フック)

1. **check-macro-arguments-have-desc**
   - マクロの引数に説明があることをチェックします。

2. **check-macro-has-description**
   - マクロに説明があることをチェックします。

3. **check-macro-has-meta-keys**
   - マクロがメタキーを持つことをチェックします。

---

### Model Checks (23フック)

1. **check-model-columns-have-desc**
   - モデルのカラムに説明があることをチェックします。

2. **check-model-columns-have-meta-keys**
   - モデルのカラムがmeta部分にキーを持つことをチェックします。

3. **check-model-has-all-columns**
   - モデルがプロパティファイルにすべてのカラムを持つことをチェックします。

4. **check-model-has-columns-with-types**
   - モデルのカラムにデータ型が指定されていることをチェックします。

5. **check-model-has-constraints**
   - モデルに制約が定義されていることをチェックします。

6. **check-model-has-contract**
   - モデルにコントラクトが有効化されていることをチェックします。

7. **check-model-has-description**
   - モデルに説明があることをチェックします。

8. **check-model-has-generic-constraints**
   - モデルに汎用制約が定義されていることをチェックします。

9. **check-model-has-labels-keys**
   - モデルがlabels部分にキーを持つことをチェックします。

10. **check-model-has-meta-keys**

- モデルがmeta部分にキーを持つことをチェックします。

11. **check-model-has-properties-file**

- モデルがプロパティファイルを持つことをチェックします。

12. **check-model-has-tests**

- モデルが指定された数のテストを持つことをチェックします。

13. **check-model-has-tests-by-group**

- モデルがテストグループから指定された数のテストを持つことをチェックします。

14. **check-model-has-tests-by-name**

- モデルがテスト名による指定された数のテストを持つことをチェックします。

15. **check-model-has-tests-by-type**

- モデルがテストタイプによる指定された数のテストを持つことをチェックします。

16. **check-model-materialization-by-childs**

- 子モデルの閾値に基づいてモデルのマテリアライゼーションをチェックします。

17. **check-model-name-contract**

- モデル名が命名規則に準拠していることをチェックします。

18. **check-model-parents-and-childs**

- モデルが特定の数（最大/最小）の親または子を持つことをチェックします。

19. **check-model-parents-database**

- 親モデルが特定のデータベースを持つことをチェックします。

20. **check-model-parents-name-prefix**

- 親モデル名が特定のプレフィックスを持つことをチェックします。

21. **check-model-parents-schema**

- 親モデルが特定のスキーマを持つことをチェックします。

22. **check-model-tags**

- モデルが有効なタグを持つことをチェックします。

23. **generate-model-properties-file**

- モデルのプロパティファイルを生成します。

---

### Script/SQL Checks (6フック)

1. **check-script-has-no-table-name**
   - スクリプトにテーブル名がないことをチェックします（すべてのテーブルに`source()`または`ref()`マクロを使用していること）。

2. **check-script-ref-and-source**
   - スクリプトに存在するrefとsourceのみが含まれていることをチェックします。

3. **check-script-semicolon**
   - スクリプトにセミコロンが含まれていないことをチェックします。

4. **remove-script-semicolon**
   - スクリプトの末尾のセミコロンを削除します。

5. **replace-script-table-names**
   - スクリプト内のテーブル名を`source()`または`ref()`マクロに置き換えます。

---

### Seed Checks (1フック)

1. **check-seed-has-meta-keys**
   - シードがメタキーを持つことをチェックします。

---

### Snapshot Checks (1フック)

1. **check-snapshot-has-meta-keys**
   - スナップショットがメタキーを持つことをチェックします。

---

### Source Checks (14フック)

1. **check-source-childs**
   - ソースが特定の数（最大/最小）の子を持つことをチェックします。

2. **check-source-columns-have-desc**
   - ソースのカラムに説明があることをチェックします。

3. **check-source-has-all-columns**
   - ソースがプロパティファイルにすべてのカラムを持つことをチェックします。

4. **check-source-has-description**
   - ソースに説明があることをチェックします。

5. **check-source-has-freshness**
   - ソースにフレッシュネス設定があることをチェックします。

6. **check-source-has-labels-keys**
   - ソースがlabels部分にキーを持つことをチェックします。

7. **check-source-has-loader**
   - ソースにローダーオプションがあることをチェックします。

8. **check-source-has-meta-keys**
   - ソースがmeta部分にキーを持つことをチェックします。

9. **check-source-has-tests**
   - ソースが指定された数のテストを持つことをチェックします。

10. **check-source-has-tests-by-group**

- ソースがテストグループから指定された数のテストを持つことをチェックします。

11. **check-source-has-tests-by-name**

- ソースがテスト名による指定された数のテストを持つことをチェックします。

12. **check-source-has-tests-by-type**

- ソースがテストタイプによる指定された数のテストを持つことをチェックします。

13. **check-source-table-has-description**

- ソーステーブルに説明があることをチェックします。

14. **check-source-tags**

- ソースが有効なタグを持つことをチェックします。

15. **generate-missing-sources**

- 欠落しているソースがある場合、このフックがソースを作成しようとします。

---

### Test Checks (2フック)

1. **check-test-has-meta-keys**
   - 単体テストがメタキーを持つことをチェックします。

2. **check-test-tags**
   - テストが有効なタグを持つことをチェックします。

---

### dbt Commands (7フック)

1. **dbt-clean**
   - `dbt clean`コマンドを実行します。

2. **dbt-compile**
   - `dbt compile`コマンドを実行します。

3. **dbt-deps**
   - `dbt deps`コマンドを実行します。

4. **dbt-docs-generate**
   - `dbt docs generate`コマンドを実行します。

5. **dbt-parse**
   - `dbt parse`コマンドを実行します。

6. **dbt-run**
   - `dbt run`コマンドを実行します。

7. **dbt-test**
   - `dbt test`コマンドを実行します。

---

## dbt-project-evaluator (29テスト)

**リポジトリ**: https://github.com/dbt-labs/dbt-project-evaluator
**ドキュメント**: https://dbt-labs.github.io/dbt-project-evaluator/

### 📊 カテゴリ別内訳

- **Documentation Tests**: 5テスト
- **Governance Tests**: 3テスト
- **Modeling Tests**: 11テスト
- **Performance Tests**: 2テスト
- **Source Tests**: 5テスト
- **Testing Tests**: 3テスト

---

### Documentation Tests (5テスト)

1. **fct_documentation_coverage**
   - モデルのドキュメンテーションカバレッジ率を計算します。

2. **fct_undocumented_models**
   - 説明が記載されていないモデルを検出します。

3. **fct_undocumented_public_models**
   - 説明が記載されていないpublicモデルを検出します。

4. **fct_undocumented_source_tables**
   - 説明が記載されていないソーステーブルを検出します。

5. **fct_undocumented_sources**
   - 説明が記載されていないソースを検出します。

---

### Governance Tests (3テスト)

1. **fct_exposures_dependent_on_private_models**
   - publicモデルではなくprivateモデルを参照しているエクスポージャーを検出します。

2. **fct_public_models_without_contract**
   - コントラクトが強制されていないpublicモデルを検出します。

3. **fct_model_directories**
   - 命名規則に基づいて適切なサブディレクトリに配置されていないモデルを検出します。

---

### Modeling Tests (11テスト)

1. **fct_chained_views_dependencies**
   - 複数の上流ビューが連鎖しているモデルを検出します。これはクエリパフォーマンスに影響を与える可能性があります。

2. **fct_direct_join_to_source**
   - モデルとソースの両方を参照しており、ステージングレイヤーをバイパスしているケースを検出します。

3. **fct_marts_or_intermediate_dependent_on_source**
   - マートモデルまたは中間モデルが生のソースを直接参照しているケースを検出します。

4. **fct_model_fanout**
   - 子を持たないモデル（未使用または終端モデルの可能性があるもの）を検出します。

5. **fct_model_naming_conventions**
   - レイヤー規則に基づいて、不適切な（または欠如した）プレフィックスを持つモデルを検出します。

6. **fct_multiple_sources_joined**
   - 複数のソースを参照しており、単一ソースステージングパターンに違反しているモデルを検出します。

7. **fct_rejoining_of_upstream_concepts**
   - 親が子の直接の親であると同時に第2レベルの親でもある親子関係を検出します。

8. **fct_root_models**
   - 直接の親が0のモデルを検出します。これはsource関数またはref関数の欠如が原因である可能性があります。

9. **fct_staging_dependent_on_marts_or_intermediate**
   - ステージングモデルがマートモデルまたは中間モデルに依存しているケース（誤った方向）を検出します。

10. **fct_staging_dependent_on_staging**

- ステージングレイヤー内のモデルが互いに依存しているケースを検出します。

11. **fct_exposure_parents_materializations**

- エクスポージャーが適切にマテリアライズされたモデル（ビューではなくテーブル）に依存していることをチェックします。

---

### Performance Tests (2テスト)

1. **fct_hard_coded_references**
   - ref()またはsource()を使用せずにハードコードされた参照を持つモデルを検出します。

2. **fct_too_many_joins**
   - 過度な数のJOINを持つモデル（パフォーマンス上の懸念）を検出します。

---

### Source Tests (5テスト)

1. **fct_duplicate_sources**
   - プロジェクト内で複数回定義されているソースを検出します。

2. **fct_source_directories**
   - データソースごとに適切なサブディレクトリに整理されていないソースを検出します。

3. **fct_source_fanout**
   - 複数の直接下流モデルで使用されているソース（高ファンアウト）を検出します。

4. **fct_sources_without_freshness**
   - フレッシュネスチェックが設定されていないソースを検出します。

5. **fct_unused_sources**
   - 子を持たないソース（未使用のソース）を検出します。

---

### Testing Tests (3テスト)

1. **fct_missing_primary_key_tests**
   - 主キーテスト（uniqueとnot_null）が欠落しているモデルを検出します。

2. **fct_test_coverage**
   - モデルのテストカバレッジ率を計算します。

3. **fct_test_directories**
   - 適切なディレクトリに整理されていないテストを検出します。

---

## dbt-score (18ルール)

**リポジトリ**: https://github.com/PicnicSupermarket/dbt-score
**ドキュメント**: https://dbt-score.picnic.tech/

### 📊 カテゴリ別内訳

- **Model Rules** (generic.py): 8ルール
- **Snapshot Rules** (generic.py): 2ルール
- **Seed Rules** (generic.py): 3ルール
- **Macro Rules** (macros.py): 3ルール
- **Optimization Rules** (generic.py): 1ルール
- **Filter Rules** (filters.py): 1ルール

---

### Model Rules (8ルール)

1. **has_description**
   - モデルには説明が必要です。

2. **columns_have_description**
   - モデルのすべてのカラムには説明が必要です。

3. **has_owner**
   - モデルには所有者が必要です。

4. **sql_has_reasonable_number_of_lines**
   - モデルのSQLクエリは長すぎてはいけません。

5. **has_example_sql**
   - モデルのドキュメントにはサンプルクエリが必要です。

6. **single_pk_defined_at_column_level**
   - 単一カラムの主キーは、カラム制約として定義する必要があります。

7. **single_column_uniqueness_at_column_level**
   - 単一カラムの一意性テストは、カラムテストとして定義する必要があります。

8. **has_uniqueness_test**
   - モデルには主キーの一意性テストが必要です。

---

### Snapshot Rules (2ルール)

1. **snapshot_has_unique_key**
   - スナップショットには一意キーが必要です。

2. **snapshot_has_strategy**
   - スナップショットにはストラテジーが必要です。

---

### Seed Rules (3ルール)

1. **seed_has_description**
   - シードには説明が必要です。

2. **seed_columns_have_description**
   - シードのすべてのカラムには説明が必要です。

3. **seed_has_owner**
   - シードには所有者が必要です。

---

### Macro Rules (3ルール)

1. **macro_has_description**
   - マクロには説明が必要です。

2. **macro_arguments_have_description**
   - すべてのマクロ引数には説明が必要です。

3. **macro_name_follows_naming_convention**
   - マクロ名はスネークケースの命名規則を使用する必要があります。

---

### Optimization Rules (1ルール)

1. **has_no_unused_is_incremental**
   - 非インクリメンタルモデルはis_incremental()を使用してはいけません。

---

### Filter Rules (1ルール)

1. **is_table**
   - モデルがテーブルであるかをチェックするフィルタールールです（スコアリングルールではありません）。

---

## カテゴリ別集計

### 全ツール横断カテゴリ別ルール数

| カテゴリ             | dbt-bouncer | dbt-checkpoint | dbt-project-evaluator | dbt-score | 合計    |
| -------------------- | ----------- | -------------- | --------------------- | --------- | ------- |
| **モデル**           | 36          | 23             | 11                    | 8         | 78      |
| **カラム**           | 6           | 3              | 0                     | 2         | 11      |
| **ソース**           | 11          | 14             | 5                     | 0         | 30      |
| **マクロ**           | 6           | 3              | 0                     | 3         | 12      |
| **テスト**           | 1           | 2              | 3                     | 1         | 7       |
| **シード**           | 6           | 1              | 0                     | 3         | 10      |
| **スナップショット** | 2           | 1              | 0                     | 2         | 5       |
| **エクスポージャー** | 3           | 1              | 1                     | 0         | 5       |
| **系譜/DAG**         | 3           | 0              | 11                    | 0         | 14      |
| **実行結果**         | 2           | 0              | 0                     | 0         | 2       |
| **メタデータ**       | 1           | 0              | 0                     | 0         | 1       |
| **ユーティリティ**   | 0           | 7              | 0                     | 0         | 7       |
| **ガバナンス**       | 4           | 0              | 3                     | 0         | 7       |
| **その他**           | 0           | 7              | 0                     | 1         | 8       |
| **合計**             | **81**      | **62**         | **34\***              | **20\***  | **190** |

\*注: カテゴリ重複のため合計が異なります

### カテゴリ別最強ツール

| カテゴリ           | 最強ツール            | ルール数 | 特徴                                                     |
| ------------------ | --------------------- | -------- | -------------------------------------------------------- |
| **モデルチェック** | dbt-bouncer           | 36       | 命名、ドキュメント、アクセス制御、契約等の包括的チェック |
| **ソースチェック** | dbt-checkpoint        | 14       | フレッシュネス、テスト、メタデータの詳細チェック         |
| **DAG分析**        | dbt-project-evaluator | 11       | 系譜、依存関係、レイヤー構造の分析                       |
| **自動修正**       | dbt-checkpoint        | 5        | ソース生成、プロパティファイル生成、SQL整形              |
| **スコアリング**   | dbt-score             | 18       | 0-10点での定量評価、進捗追跡                             |

---

## 取得方法と再現性

### データ取得コマンド

#### dbt-bouncer

```bash
find src/dbt_bouncer/checks -name "*.py" -exec grep -h "^class Check" {} \; | wc -l
# 結果: 81
```

#### dbt-checkpoint

```bash
grep "^- id:" .pre-commit-hooks.yaml | wc -l
# 結果: 62
```

#### dbt-project-evaluator

```bash
find models -name "fct_*.sql" | wc -l
# 結果: 29
```

#### dbt-score

```bash
grep -c "@rule" src/dbt_score/rules/*.py
# 結果: 18
```

---

## 更新履歴

- **2026-02-27**: 各ルールに説明を追加、カテゴリ別に整理、全説明を日本語に翻訳
- **2026-02-26**: 初版作成、全190ルールをリスト化

---

**関連ドキュメント**:

- [dbt品質保証ツール機能比較](./dbt-tools-feature-comparison.md)
- [dbt-bouncer公式ドキュメント](https://godatadriven.github.io/dbt-bouncer/)
- [dbt-checkpoint HOOKS.md](https://github.com/dbt-checkpoint/dbt-checkpoint/blob/main/HOOKS.md)
- [dbt-project-evaluator公式サイト](https://dbt-labs.github.io/dbt-project-evaluator/)
- [dbt-score公式サイト](https://dbt-score.picnic.tech/)
