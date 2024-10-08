package com.worlabel.domain.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.worlabel.domain.project.entity.Project;
import com.worlabel.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "ai_model")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AiModel extends BaseEntity {

    /**
     * Model ID
     */
    @Id
    @Column(name = "model_id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * Model name
     */
    @Column(name = "name", length = 50)
    private String name;

    /**
     * model key
     */
    @Column(name = "model_key", length = 50)
    private String modelKey;

    /**
     * version
     */
    @Column(name = "version")
    private int version;

    /**
     * 소속 프로젝트 Null이면 Default
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = true)
    @JsonIgnore
    private Project project;

    private AiModel(String name, String modelKey, int version, Project project) {
        this.name = name;
        this.modelKey = modelKey;
        this.version = version;
        this.project = project;
    }

    public static AiModel of(final String name, final String key, final int version, final Project project) {
        return new AiModel(name, key, version, project);
    }

    public static AiModel of(final String name, final Project project) {
        return new AiModel(name, null, 0, project);
    }

    public void rename(final String newName) {
        this.name = newName;
    }
}
