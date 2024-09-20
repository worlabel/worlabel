package com.worlabel.domain.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.worlabel.domain.project.entity.Project;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "ai_model")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AIModel {

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
    @Column(name = "key", length = 50)
    private String key;

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

    private AIModel(String name, String key, int version, Project project) {
        this.name = name;
        this.key = key;
        this.version = version;
        this.project = project;
    }

    public static AIModel of(final String name, final String key, final int version, final Project project) {
        return new AIModel(name, key, version, project);
    }

}
