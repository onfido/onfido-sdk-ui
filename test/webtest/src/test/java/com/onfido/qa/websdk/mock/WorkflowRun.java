package com.onfido.qa.websdk.mock;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.onfido.qa.websdk.mock.config.ConfigBase;
import com.onfido.qa.websdk.mock.config.UploadDocumentConfig;

import java.util.Arrays;
import java.util.EnumMap;
import java.util.Map;
import java.util.UUID;

import static com.onfido.qa.websdk.DocumentType.PASSPORT;

@SuppressWarnings({"PublicField", "ClassWithTooManyFields"})
public class WorkflowRun {

    @SuppressWarnings("StaticCollection")
    private final static Map<TaskDefinition, ConfigBase> DEFAULT_CONFIG = new EnumMap<>(TaskDefinition.class);

    static {
        var uploadDocumentConfig = new UploadDocumentConfig(Arrays.asList(new UploadDocumentConfig.DocumentSelection(PASSPORT, "AFG"), new UploadDocumentConfig.DocumentSelection(PASSPORT, "ALB")));

        DEFAULT_CONFIG.put(TaskDefinition.UPLOAD_DOCUMENT, uploadDocumentConfig);
        DEFAULT_CONFIG.put(TaskDefinition.UPLOAD_DOCUMENT_PHOTO, uploadDocumentConfig);
    }

    public WorkflowRun(UUID workflowRunId, TaskDefinition taskDefinition) {
        this(workflowRunId, taskDefinition, null);
    }

    public WorkflowRun(UUID workflowRunId, TaskDefinition taskDefinition, ConfigBase config) {
        this.taskDefId = taskDefinition;
        this.id = workflowRunId.toString();
        this.config = config;
    }

    @JsonProperty("applicant_id")
    public String applicationId = UUID.randomUUID().toString();

    @JsonProperty
    public boolean finished;

    @JsonProperty("has_remaining_interactive_tasks")
    public boolean hasRemainingInteractiveTasks = true;

    @JsonProperty
    public String id;

    @JsonProperty("profile_data")
    public ProfileData profileData = new ProfileData();

    @JsonProperty
    public State state = State.IN_PROGRESS;

    @JsonProperty("task_def_id")
    public TaskDefinition taskDefId;

    @JsonProperty("task_id")
    public String taskId = UUID.randomUUID().toString();

    public ConfigBase config;

    @JsonProperty("config")
    private ConfigBase _config() {

        if (config != null) {
            return config;
        }

        return DEFAULT_CONFIG.getOrDefault(taskDefId, null);
    }

    @JsonProperty("task_type")
    public TaskType getTaskType() {

        if (taskDefId == null) {
            return null;
        }

        return TaskType.INTERACTIVE;
    }

    @JsonProperty("updated_at")
    public String updatedAt;

    @JsonProperty("version_id")
    public int versionId = 2;

    @JsonProperty("workflow_id")
    public String workflowId = UUID.randomUUID().toString();
}
